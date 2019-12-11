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
    { session : Session
    , token : Maybe OAuth.Token
    , error : Maybe String
    , menuModel : Menu.Model
    , bookSelectorModel : BookSelector.Model
    , bookSelectorDetailModel : Maybe BookSelectorDetail.Model
    , loginModel : Login.Model
    }

initialState : Maybe OAuth.Token -> (Model, Cmd Msg )
initialState maybeToken =
    let
        ( menuModel, menuCmd ) =
            Menu.initialState maybeToken
    in
    (
        { session = initialSession
        , token = Nothing
        , error = Nothing
        , menuModel = menuModel
        , bookSelectorModel = BookSelector.initialModel maybeToken
        , bookSelectorDetailModel = Nothing
        , loginModel = Login.initialModel maybeToken
        }
        , Cmd.map MenuMsg menuCmd
    )




type Msg
    = BookSelectorMsg BookSelector.Msg
    | BookSelectorDetailMsg BookSelectorDetail.Msg
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
        , case model.session.page of
            LoginPage ->
                Login.view model.loginModel |> Html.map LoginMsg
        
            BookSelectorPage ->
                BookSelector.view model.bookSelectorModel |> Html.map BookSelectorMsg
    
            BookSelectorDetailPage ->
                case model.bookSelectorDetailModel of
                    Just bookSelectorDetailModel ->
                        BookSelectorDetail.view bookSelectorDetailModel |> Html.map BookSelectorDetailMsg
                
                    Nothing ->
                        text "Nothing"
    
            _ ->
                text "Nothing"
 
        ]
    }


notFoundView : Html msg
notFoundView =
    h3 [] [ text "Oops! The page you requested was not found!" ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
            waarzijnwe = Debug.log "Main" "Update"
    in
    case msg of
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

        MenuMsg (Menu.ChangedPage page) ->
            let
                session = model.session
            in
                   ( { model | session = changedPageSession page session } , Cmd.none )

        BookSelectorMsg (ClickedBookDetail searchBook) ->
            let
                session = Debug.log "BookSelectorMsg ClickedBookDetail" model.session
                searchbooks = model.bookSelectorModel.searchbooks
            in
                   ( { model 
                     | session = changedPageSession BookSelectorDetailPage session
                     , bookSelectorDetailModel = Just (BookSelectorDetail.initialModel  searchbooks searchBook)
                      } , Cmd.none )

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

        BookSelectorDetailMsg subMsg ->
            case model.bookSelectorDetailModel of
                Just bookSelectorDetailModel ->
                    let
                        ( bookSelectorDetailModelUpdated, bookSelectorDetailCmd ) =
                            BookSelectorDetail.update subMsg bookSelectorDetailModel
                    in
                        ( 
                            { model
                            | bookSelectorDetailModel = Just bookSelectorDetailModelUpdated
                            }
                            , Cmd.map BookSelectorDetailMsg bookSelectorDetailCmd
                        )
                Nothing ->
                    ( model, Cmd.none )

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


