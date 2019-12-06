module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav
import Url exposing (Url)
import Html exposing (..)
import Debug as Debug exposing (log)
import OAuth
import OAuth.Implicit

import BookSelector exposing (..)
import Login exposing (..)

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


type alias Model =
    { page : Page
    , token : Maybe OAuth.Token
    , error : Maybe String
    , menuModel : Menu.Model
    , bookSelectorModel : BookSelector.Model
    , loginModel : Login.Model
    }

initialState : Maybe OAuth.Token -> (Model, Cmd Msg)
initialState maybeToken =
    let
        ( menuModel, menuCmd ) =
            Menu.initialState maybeToken
    in
    (
        { page = NotFoundPage
        , token = Nothing
        , error = Nothing
        , menuModel = menuModel
        , bookSelectorModel = BookSelector.initialModel maybeToken
        , loginModel = Login.initialModel maybeToken
        }
        , Cmd.map MenuMsg menuCmd
    )

type Page
    = NotFoundPage
    | BookSelectorPage BookSelector.Model
    | LoginPage Login.Model


type Msg
    = BookSelectorMsg BookSelector.Msg
    | LoginMsg Login.Msg
    | MenuMsg Menu.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


-- refresh page : 
init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
    case OAuth.Implicit.parseToken (queryAsFragment url) of
        OAuth.Implicit.Empty ->
            initialState Nothing

        OAuth.Implicit.Success { token, state } ->
            let
                token1 = Debug.log "Main.init Success" token
                ( model1, cmd1 ) =
                    initialState (Just token)
            in
            ( 
                { model1 
                | token = Just token
                }
                ,
                cmd1
            )

        OAuth.Implicit.Error { error, errorDescription } ->
            initialState Nothing


view : Model -> Document Msg
view model =
    { title = "Lunatech Library"
    , body = 
        [ CDN.stylesheet
        , Menu.view model.menuModel 
            |> Html.map MenuMsg
        , case model.menuModel.active of
            Just Login ->
                Login.view model.loginModel |> Html.map LoginMsg
        
            Just BookSelector ->
                BookSelector.view model.bookSelectorModel |> Html.map BookSelectorMsg
        
            Just _ ->
                text "Nothing"

            Nothing -> 
                text "Nothing"
                
        ]
    }


currentView : Model -> Html Msg
currentView model =
    case model.page of
        NotFoundPage ->
            notFoundView

        BookSelectorPage pageModel ->
            BookSelector.view pageModel
                |> Html.map BookSelectorMsg

        LoginPage pageModel ->
            Login.view pageModel
                |> Html.map LoginMsg


notFoundView : Html msg
notFoundView =
    h3 [] [ text "Oops! The page you requested was not found!" ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
            waarzijnwe = Debug.log "Main" "Update"
    in
    case msg of
        BookSelectorMsg subMsg ->
            let
                ( bookSelectorModel, bookSelectorCmd ) =
                    BookSelector.update subMsg model.bookSelectorModel
            in
                ( 
                    { model
                    | bookSelectorModel = bookSelectorModel
                    }
                    , Cmd.map BookSelectorMsg bookSelectorCmd
                )

        LoginMsg subMsg ->
            let
                ( loginModel, loginCmd ) =
                    Login.update subMsg model.loginModel
            in
                ( 
                    { model
                    | loginModel = loginModel
                    }
                    , Cmd.map LoginMsg loginCmd
                )

        MenuMsg subMsg ->
            let
                ( menuModel, menuCmd ) =
                    Menu.update subMsg model.menuModel
            in
                ( 
                    { model
                    | menuModel = menuModel
                    }
                    , Cmd.map MenuMsg menuCmd
                )
        
        LinkClicked _ ->
            ( model, Cmd.none )

        UrlChanged _ ->
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


