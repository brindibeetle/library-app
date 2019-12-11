module Login exposing (..)

import Browser
import Browser.Navigation as Navigation exposing (..)
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
import OAuth
import OAuth.Implicit exposing (defaultParsers)
import Url exposing (Protocol(..), Url)
import Url.Parser.Query as Query
import Json.Decode as Json

import RemoteData exposing (RemoteData, WebData, succeed)

import MyError exposing (buildErrorMessage)

import Bootstrap.CDN as CDN
import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block

import Debug as Debug

type alias Model =
    { error : Maybe String
    , token : Maybe OAuth.Token
    , state : String
    }

initialModel : Maybe OAuth.Token -> Model
initialModel maybeToken =
    { error = Nothing
    , token = maybeToken
    , state = ""
    }


type
    Msg
    -- No Operation, terminal case
    = NoOp
      -- The 'sign-in' button has been hit
    | SignInRequested
      -- The 'sign-out' button has been hit
    | SignOutRequested
      -- Got a response from the googleapis user info
    | GotUserInfo (Result Http.Error Profile)


type alias OAuthConfiguration =
    { authorizationEndpoint : Url
    , tokenEndpoint : Url
    , profileEndpoint : Url
    , clientId : String
    , secret : String
    , scope : List String
    , profileDecoder : Json.Decoder Profile
    }

type alias Profile =
    { name : String
    , picture : String
    }


init : ( Model, Cmd Msg )
init =
    let
        model1 = Debug.log "model" "pio"
    in
    ( { error = Nothing, token = Nothing, state = "" }
    , Cmd.none
    )

view : Model -> Html Msg
view model = div
                [ ]
                [ CDN.stylesheet
                , text "Elm OAuth2 Example - Implicit Flow"
                , viewSignInButton
                ]


viewSignInButton : Html Msg
viewSignInButton =
    Button.button
        [ Button.primary, Button.onClick SignInRequested
        ]
        [ text "Sign in" ]


configurationFor : OAuthConfiguration
configurationFor =
   let
        defaultHttpsUrl =
            { protocol = Https
            , host = ""
            , path = ""
            , port_ = Nothing
            , query = Nothing
            , fragment = Nothing
            }
    in
        { clientId = "937704847273-2ctk7g4e2qshu89gqch4at5qskqdus8n.apps.googleusercontent.com" -- libary-api-frontend / Webclient 2
        , secret = "<secret>"
        , authorizationEndpoint = { defaultHttpsUrl | host = "accounts.google.com", path = "/o/oauth2/v2/auth" }
        , tokenEndpoint = { defaultHttpsUrl | host = "www.googleapis.com", path = "/oauth2/v4/token" }
        , profileEndpoint = { defaultHttpsUrl | host = "www.googleapis.com", path = "/oauth2/v1/userinfo" }
        , scope = [ "email", "profile", "openid" ]
        , profileDecoder =
            Json.map2 Profile
                (Json.field "name" Json.string)
                (Json.field "picture" Json.string)
        }

redirectUri : Url
-- redirectUri = Url.fromString "http://localhost:3000"
redirectUri = 
    { protocol = Http
    , host = "localhost"
    , path = "/login"
    , port_ = Just 8000
    , query = Nothing
    , fragment = Nothing
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
          let
                res1 = Debug.log "NoOp" model
            in
             ( model, Cmd.none )

        SignInRequested  ->
            let
                config = configurationFor

                auth =
                    { clientId = config.clientId
                    , redirectUri = redirectUri
                    , scope = config.scope
                    , state = Just ""
                    --  , state = Just (makeState model.state provider) // google.<model.state>
                    , url = config.authorizationEndpoint
                    }
            in
            Debug.log "lets see"
            ( model
            , auth |> OAuth.Implicit.makeAuthorizationUrl |> Url.toString |> Navigation.load
            )

        SignOutRequested ->
            ( model
            , Navigation.load (Url.toString redirectUri)
            )

        GotUserInfo res ->
            let
                res1 = Debug.log "res" res
            in
            
            case res of
                Err err ->
                    ( { model | error = Just "Unable to fetch user profile ¯\\_(ツ)_/¯" }
                    , Cmd.none
                    )

                Ok profile ->
                    (model, Cmd.none
                    )



baseUrl : String
baseUrl =
    "https://www.googleapis.com/books/v1/volumes"

