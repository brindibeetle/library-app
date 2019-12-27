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
import Checkin exposing (..)
import LibraryAppCDN as LibraryAppCDN
import Domain.InitFlags exposing (..)

-- import Route exposing (Route)
import Menu exposing (..)
import Bootstrap.CDN as CDN


main : Program String Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

type Model =
    BookSelector BookSelector.Model Session
    | Library Library.Model Session
    | Checkin Checkin.Model Session
    | Login Session
    | Logout Session
    | Welcome Session


initialState : Maybe OAuth.Token -> String -> (Model, Cmd Msg )
initialState maybeToken flags =
    let
        a = Debug.log "initialState" (getInitFlags flags)
        ( navbarState, menuCmd ) = Menu.initialState
        session = initialSession maybeToken navbarState (getInitFlags flags)
        ( loginSession, loginCmd ) = Login.initialLogin session
        
    in
    (
        Login loginSession
        , Cmd.batch [ Cmd.map MenuMsg menuCmd, Cmd.map LoginMsg loginCmd ]
    )


-- refresh page : 
init : String -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
    case OAuth.Implicit.parseToken (queryAsFragment url) of
        OAuth.Implicit.Empty ->
            initialState Nothing flags

        OAuth.Implicit.Success { token, state } ->
            initialState (Just token) flags

        OAuth.Implicit.Error { error, errorDescription } ->
            initialState Nothing flags


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

                Checkin checkinModel session  ->
                    Checkin.view checkinModel |> Html.map CheckinMsg   
            ]
        }


toSession : Model -> Session
toSession model =
    case model of
        BookSelector _ session ->
            session
        Library _ session ->
            session
        Checkin _ session ->
            session
        Login session ->
            session
        Logout session ->
            session
        Welcome session ->
            session


toModel :  Model -> Cmd Msg -> Session -> ( Model, Cmd Msg )
toModel model cmd session =
    case ( session.page, model ) of
        ( WelcomePage, _ ) ->
            ( Welcome session, cmd )

        ( BookSelectorPage, BookSelector bookSelectorModel session1 ) ->
            ( BookSelector bookSelectorModel session, cmd )

        ( LibraryPage, Library libraryModel session1  ) ->
            ( Library libraryModel session, cmd )

        ( CheckinPage, Checkin checkinModel session1  ) ->
            ( Checkin checkinModel session, cmd )

        ( LoginPage, model1 ) ->
            ( Login (toSession model1), cmd )

        ( LogoutPage, model1 ) ->
            ( Logout (toSession model1), cmd )

        ( BookSelectorPage, model1 ) ->
            ( BookSelector BookSelector.initialModel session, cmd )

        ( LibraryPage, model1 ) ->
            let
                ( libraryModel, initialLibraryCmd ) = Library.initialModelCmd session
            in
                ( Library libraryModel session, Cmd.batch [ cmd, initialLibraryCmd |> Cmd.map LibraryMsg ] )

        ( CheckinPage, model1 ) ->
            let
                ( checkinModel, initialCheckinCmd ) = Checkin.initialModelCmd session
            in
                ( Checkin checkinModel session, Cmd.batch [ cmd, initialCheckinCmd |> Cmd.map CheckinMsg ] )


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
    | CheckinMsg Checkin.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case (msg, model) of
        ( WelcomeMsg subMsg, model1 ) ->
           let
                ( sessionUpdated, welcomeCmd ) =
                    Welcome.update subMsg (toSession model1)
            in
                toModel model1 (welcomeCmd |> Cmd.map WelcomeMsg) sessionUpdated 

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
                toModel model1 (menuCmd |> Cmd.map MenuMsg)  sessionUpdated

        ( BookSelectorMsg subMsg, BookSelector bookSelectorModel session ) ->
            let
                bookSelectorUpdated =
                    BookSelector.update subMsg bookSelectorModel session
            in
                toModel (BookSelector bookSelectorUpdated.model bookSelectorUpdated.session) (bookSelectorUpdated.cmd |> Cmd.map BookSelectorMsg) bookSelectorUpdated.session

        ( LibraryMsg subMsg, Library libraryModel session ) ->
            let
                libraryUpdated =
                    Library.update subMsg libraryModel session
            in
                toModel (Library libraryUpdated.model libraryUpdated.session) (libraryUpdated.cmd |> Cmd.map LibraryMsg) libraryUpdated.session

        ( CheckinMsg subMsg, Checkin checkinModel session ) ->
            let
                checkinUpdated =
                    Checkin.update subMsg checkinModel session
            in
                toModel (Checkin checkinUpdated.model checkinUpdated.session) (checkinUpdated.cmd |> Cmd.map CheckinMsg) checkinUpdated.session

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


