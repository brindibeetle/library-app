module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav
import Url exposing (Url)
import Html exposing (..)
import Debug as Debug exposing (log)
import OAuth
import OAuth.Implicit

import Page exposing (..)
import Session exposing (..)
import BookSelector exposing (..)
import BookSelectorDetail exposing (..)
import Login

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
    | BookSelectorDetail BookSelectorDetail.Model Session
    | Login Session
    | Landing Session


initialState : Maybe OAuth.Token -> (Model, Cmd Msg )
initialState maybeToken =
    let
        ( navbarState, menuCmd ) =
            Menu.initialState maybeToken
        session = initialSession maybeToken navbarState
    in
    (
        Landing session
        , Cmd.map MenuMsg menuCmd
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


view : Model -> Document Msg
view model =
    let
        sessionModel = toSession model
    in
        { title = "Lunatech Library"
        , body = 
            [ CDN.stylesheet
            , Menu.view (toSession model)
                |> Html.map MenuMsg
            , case model of
                Login session ->
                    Login.view |> Html.map LoginMsg
            
                BookSelector bookSelectorModel session ->
                    BookSelector.view bookSelectorModel |> Html.map BookSelectorMsg
        
                BookSelectorDetail bookSelectorDetailModel session  ->
                    BookSelectorDetail.view bookSelectorDetailModel |> Html.map BookSelectorDetailMsg
                    
                Landing _ ->
                    text "Nothing"
    
            ]
        }


toSession : Model -> Session
toSession model =
    case model of
        BookSelector _ session ->
            session
        BookSelectorDetail _ session ->
            session
        Login session ->
            session
        Landing session ->
            session


toModel : Session -> Model -> Model
toModel session model =
    case ( session.page, model ) of
        ( LandingPage, _ ) ->
            Landing session

        ( BookSelectorPage, BookSelector bookSelectorModel session1 ) ->
            BookSelector bookSelectorModel session

        ( BookSelectorDetailPage, BookSelectorDetail bookSelectorDetailModel session1 ) ->
            BookSelectorDetail bookSelectorDetailModel session

        ( BookSelectorDetailPage, BookSelector bookSelectorModel session1 ) ->
            case bookSelectorModel.bookSelectorDetailModel of
                Just bookSelectorDetailModel ->
                    BookSelectorDetail bookSelectorDetailModel session
                Nothing ->
                    model

        -- not directly, only via BookSelector
        ( BookSelectorDetailPage, model1 ) ->
            model1

        ( LoginPage, model1 ) ->
            Login (toSession model1)

        ( BookSelectorPage, model1 ) ->
            BookSelector (BookSelector.initialModel session) session



notFoundView : Html msg
notFoundView =
    h3 [] [ text "Oops! The page you requested was not found!" ]


-- #####
-- ##### UPDATE
-- #####


type Msg
    = BookSelectorMsg BookSelector.Msg
    | BookSelectorDetailMsg BookSelectorDetail.Msg
    | LoginMsg Login.Msg
    | MenuMsg Menu.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        waarzijnwe = Debug.log "Main" "Update"
        session1 = Debug.log "model.session = " (toSession model)
    in
    case (msg, model) of
        ( LoginMsg subMsg, Login session ) ->
            let
                ( sessionUpdated, loginCmd ) =
                    Login.update subMsg session 
            in
                ( Landing sessionUpdated, loginCmd  |> Cmd.map LoginMsg )    

        ( MenuMsg subMsg, model1 ) ->
           let
                waarzijnwe1 = Debug.log "Main" "MenuMsg"
                ( sessionUpdated, menuCmd ) =
                    Menu.update subMsg (toSession model1)
                session12 = Debug.log "menuModel.session = " sessionUpdated
            in
                ( toModel sessionUpdated model1, menuCmd |> Cmd.map MenuMsg )
                --     { model
                --     | menuModel = menuModel
                --     , session = session
                --     }
                --     , Cmd.map MenuMsg menuCmd
                -- )

        -- BookSelectorMsg (ClickedBookDetail searchBook) ->
        --     let
        --         session = Debug.log "BookSelectorMsg ClickedBookDetail" model.session
        --         searchbooks = model.bookSelectorModel.searchbooks
        --     in
        --         ( { model 
        --             | session = changedPageSession BookSelectorDetailPage session
        --             , bookSelectorDetailModel = Just (BookSelectorDetail.initialModel session session.token searchbooks searchBook)
        --             } , Cmd.none )

        ( BookSelectorMsg subMsg, BookSelector bookSelectorModel session ) ->
            let
                waarzijnwe1 = Debug.log "Main" "BookSelectorMsg"
                session2 = Debug.log "model.session = " session
                -- { bookSelectorModelUpdated, sessionUpdated, bookSelectorCmd } =
                bookSelectorUpdated =
                    BookSelector.update subMsg bookSelectorModel
                session12 = Debug.log "bookSelectorModel.session = " session
            in
                ( BookSelector bookSelectorUpdated.model bookSelectorUpdated.session, bookSelectorUpdated.cmd |> Cmd.map BookSelectorMsg)

        ( BookSelectorDetailMsg subMsg, BookSelectorDetail bookSelectorDetailModel session ) ->
            let
                ( bookSelectorDetailModelUpdated, bookSelectorDetailCmd ) =
                    BookSelectorDetail.update subMsg bookSelectorDetailModel
            in
                ( BookSelectorDetail bookSelectorDetailModelUpdated session, Cmd.map BookSelectorDetailMsg bookSelectorDetailCmd )

        -- MenuMsg subMsg ->
        --     let
        --         ( menuModel, menuCmd ) =
        --             Menu.update subMsg model.menuModel
        --     in
        --         ( 
        --             { model
        --             | menuModel = menuModel
        --             }
        --             , Cmd.map MenuMsg menuCmd
        --         )
        
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


oauthProviderFromState : String -> Maybe OAuthProvider
oauthProviderFromState str =
        -- str
        --     |> stringLeftUntil (\c -> c == ".")
        --     |> oauthProviderFromString
    Just Google

type OAuthProvider
    = Google
    | Spotify
    | LinkedIn

oauthProviderFromString : String -> Maybe OAuthProvider
oauthProviderFromString str =
    case str of
        "google" ->
            Just Google

        "spotify" ->
            Just Spotify

        "linkedin" ->
            Just LinkedIn

        _ ->
            Nothing

stringLeftUntil : (String -> Bool) -> String -> String
stringLeftUntil predicate str =
    let
        ( h, q ) =
            ( String.left 1 str, String.dropLeft 1 str )
    in
    if h == "" || predicate h then
        ""

    else
        h ++ stringLeftUntil predicate q


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


