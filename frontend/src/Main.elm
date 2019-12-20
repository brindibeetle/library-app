module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav
import Url exposing (Url)
import Html exposing (..)
import Debug as Debug exposing (log)
import OAuth
import OAuth.Implicit

import Session exposing (..)
import Login
import Logout
import Welcome
import BookSelector exposing (..)
import Library exposing (..)
import LibraryAppCDN as LibraryAppCDN

import Route exposing (Route)
import Menu exposing (..)
import Bootstrap.CDN as CDN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }


type Model =
    BookSelector BookSelector.Model Session
    | Library Library.Model Session
    | Login Session
    | Logout Session
    | Welcome Session


initialState : Maybe OAuth.Token -> (Model, Cmd Msg )
initialState maybeToken =
    let
        ( navbarState, menuCmd ) = Menu.initialState
        session = initialSession maybeToken navbarState
        ( loginSession, loginCmd ) = Login.initialLogin session
        
    in
    (
        Login loginSession
        , Cmd.batch [ Cmd.map MenuMsg menuCmd, Cmd.map LoginMsg loginCmd ]
    )


-- refresh page : 
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
    case OAuth.Implicit.parseToken (queryAsFragment url) of
        OAuth.Implicit.Empty ->
            initialState Nothing

        OAuth.Implicit.Success { token, state } ->
            initialState (Just token)

        OAuth.Implicit.Error { error, errorDescription } ->
            initialState Nothing


-- #####
-- #####   VIEW
-- #####


view : Model -> Document Msg
view model =
    let
        sessionModel = toSession model
    in
        { title = "Lunatech Library"
        , body = 
            [ CDN.stylesheet
            , LibraryAppCDN.stylesheet
            , Menu.view (toSession model)
                |> Html.map MenuMsg
            , case model of
                Welcome _ ->
                    Welcome.view sessionModel |> Html.map WelcomeMsg

                Login session ->
                    Login.view |> Html.map LoginMsg

                Logout session ->
                    Logout.view |> Html.map LogoutMsg
            
                BookSelector bookSelectorModel session ->
                    BookSelector.view bookSelectorModel |> Html.map BookSelectorMsg
        
                Library libraryModel session  ->
                    Library.view libraryModel |> Html.map LibraryMsg   
            ]
        }


toSession : Model -> Session
toSession model =
    case model of
        BookSelector _ session ->
            session
        Library _ session ->
            session
        Login session ->
            session
        Logout session ->
            session
        Welcome session ->
            session


toModel :  Model -> Session -> Model
toModel model session =
    case ( session.page, model ) of
        ( WelcomePage, _ ) ->
            Welcome session

        ( BookSelectorPage, BookSelector bookSelectorModel session1 ) ->
            BookSelector bookSelectorModel session

        ( LibraryPage, Library libraryModel session1  ) ->
            Library libraryModel session

        ( LoginPage, model1 ) ->
            Login (toSession model1)

        ( LogoutPage, model1 ) ->
            Logout (toSession model1)

        ( BookSelectorPage, model1 ) ->
            BookSelector BookSelector.initialModel session

        ( LibraryPage, model1 ) ->
            Library Library.initialModel session


notFoundView : Html msg
notFoundView =
    h3 [] [ text "Oops! The page you requested was not found!" ]


-- #####
-- #####   UPDATE
-- #####


type Msg
    = WelcomeMsg Welcome.Msg
    | LoginMsg Login.Msg
    | LogoutMsg Logout.Msg
    | MenuMsg Menu.Msg
    | BookSelectorMsg BookSelector.Msg
    | LibraryMsg Library.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case (msg, model) of
        ( WelcomeMsg subMsg, model1 ) ->
           let
                ( sessionUpdated, menuCmd ) =
                    Welcome.update subMsg (toSession model1)
            in
                ( toModel model1 sessionUpdated, menuCmd |> Cmd.map WelcomeMsg )

        ( LoginMsg subMsg, model1 ) ->
            let
                ( sessionUpdated, loginCmd ) =
                    Login.update subMsg (toSession model1) 
            in
                ( Welcome sessionUpdated, loginCmd  |> Cmd.map LoginMsg )    

        ( LogoutMsg subMsg, Logout session ) ->
            let
                ( sessionUpdated, logoutCmd ) =
                    Logout.update subMsg session 
            in
                ( Welcome sessionUpdated, logoutCmd  |> Cmd.map LogoutMsg )    

        ( MenuMsg subMsg, model1 ) ->
           let
                ( sessionUpdated, menuCmd ) =
                    Menu.update subMsg (toSession model1)
            in
                ( toModel model1 sessionUpdated, menuCmd |> Cmd.map MenuMsg )

        ( BookSelectorMsg subMsg, BookSelector bookSelectorModel session ) ->
            let
                bookSelectorUpdated =
                    BookSelector.update subMsg bookSelectorModel session
            in
                ( toModel (BookSelector bookSelectorUpdated.model bookSelectorUpdated.session) bookSelectorUpdated.session
                    , bookSelectorUpdated.cmd |> Cmd.map BookSelectorMsg)

        ( LibraryMsg subMsg, Library libraryModel session ) ->
            let
                libraryUpdated =
                    Library.update subMsg libraryModel session
            in
                ( toModel (Library libraryUpdated.model libraryUpdated.session) libraryUpdated.session
                    , libraryUpdated.cmd |> Cmd.map LibraryMsg)

        ( LinkClicked _, _ ) ->
            ( model, Cmd.none )

        ( UrlChanged _, _ ) ->
            ( model, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )



queryAsFragment : Url -> Url
queryAsFragment url =
    case url.fragment of
        Just "_=_" ->
            { url | fragment = url.query, query = Nothing }

        Nothing ->
            { url | fragment = url.query, query = Nothing }

        _ ->
            url


errorResponseToString : { error : OAuth.ErrorCode, errorDescription : Maybe String } -> String
errorResponseToString { error, errorDescription } =
    let
        code =
            OAuth.errorCodeToString error

        desc =
            errorDescription
                |> Maybe.withDefault ""
                |> String.replace "+" " "
    in
    code ++ ": " ++ desc


