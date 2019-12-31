module Login exposing (..)

import Browser.Navigation as Navigation exposing (..)
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
import OAuth
import OAuth.Implicit exposing (defaultParsers)
import Url exposing (Protocol(..), Url)
import Json.Decode as Json

import RemoteData exposing (RemoteData, WebData, succeed)

import Bootstrap.Button as Button


import Session exposing (..)
import Utils exposing (..)
import Domain.User exposing (..)
import Domain.UserInfo exposing (..)


-- #####
-- #####   INIT
-- #####


initialLogin : Session -> ( Session, Cmd Msg )
initialLogin session =
    case session.token of
        Just token ->
            ( {session
              | user = RemoteData.Loading
              }
            , Cmd.batch [ getUser session token, getUserInfo session token ] )

        Nothing ->
            ( session, Cmd.none )
    

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


-- #####
-- #####   VIEW
-- #####


view : Html Msg
view = div [ class "container" ]
    [ h1 [] [ text "Login" ]
        , p [] [ text "The login will take place via Google's OAuth authentication."
            , br [] [], text "Please take into account that only Lunatech's email addresses (lunatech.be, lunatech.fr, lunatech.nl) are allowed."
               ]
        , p [] [ Button.button
                [ Button.primary, Button.onClick SignInRequested ]
                [ text "Login via Google" ]
            ]
    ]


clientId : Session -> String
clientId session = Session.getGoogleClientId session


configurationFor : Session -> OAuthConfiguration
configurationFor session =
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
        { clientId = clientId session
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


redirectUrl : Session -> Url
redirectUrl session = 
    Session.getThisBaseUrl session


-- #####
-- #####   UPDATE
-- #####

type Msg =
    SignInRequested
    | DoUserReceived (WebData User)
    | DoUserInfoReceived (WebData UserInfo)


update : Msg -> Session -> ( Session, Cmd Msg )
update msg session =
    case msg of

        SignInRequested  ->
            let
                config = configurationFor session

                auth =
                    { clientId = config.clientId
                    , redirectUri = redirectUrl session
                    , scope = config.scope
                    , state = Just ""
                    --  , state = Just (makeState model.state provider) // google.<model.state>
                    , url = config.authorizationEndpoint
                    }
            in
            ( session
            , auth |> OAuth.Implicit.makeAuthorizationUrl |> Url.toString |> Navigation.load
            )

        DoUserReceived response ->
            ( { session | user = response }
            , Cmd.none )

        DoUserInfoReceived response ->
            ( { session | userInfo = response }
            , Cmd.none )


libraryApiBaseUrl : Session -> String
libraryApiBaseUrl session =
    Session.getLibraryApiBaseUrlString session


getUser : Session -> OAuth.Token -> Cmd Msg
getUser session token =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = (libraryApiBaseUrl session) ++ "/user" ++ "?access_token=" ++ puretoken

    in
        Http.get
            { url = requestUrl
            , expect =
                userDecoder
                |> Http.expectJson (RemoteData.fromResult >> DoUserReceived)
            }


getUserInfo : Session -> OAuth.Token -> Cmd Msg
getUserInfo session token =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = (libraryApiBaseUrl session) ++ "/user/info" ++ "?access_token=" ++ puretoken

    in
        Http.get
            { url = requestUrl
            , expect =
                userInfoDecoder
                |> Http.expectJson (RemoteData.fromResult >> DoUserInfoReceived)
            }
