module Login exposing (..)

import Browser exposing (Document, application)
import Browser.Navigation as Navigation exposing (Key)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import OAuth
import OAuth.Implicit exposing (defaultParsers)
import Url exposing (Protocol(..), Url)
import Url.Parser.Query as Query
import Http


type alias Model =
    { redirectUri : Url
    , error : Maybe String
    , token : Maybe OAuth.Token
    , profile : Maybe Profile
    , state : String
    }


type
    Msg
    -- No Operation, terminal case
    = NoOp
      -- The 'sign-in' button has been hit
    | SignInRequested OAuthConfiguration
      -- The 'sign-out' button has been hit
    | SignOutRequested
      -- Got a response from the googleapis user info
    | GotUserInfo (Result Http.Error Profile)


type alias Profile =
    { name : String
    , picture : String
    }


type OAuthProvider
    = Google
    | Spotify
    | LinkedIn


type alias OAuthConfiguration =
    { provider : OAuthProvider
    , authorizationEndpoint : Url
    , tokenEndpoint : Url
    , profileEndpoint : Url
    , clientId : String
    , secret : String
    , scope : List String
    , profileDecoder : Json.Decoder Profile
    }

makeInitModel : String -> Url -> Model
makeInitModel bytes origin =
    { redirectUri = { origin | query = Nothing, fragment = Nothing }
    , error = Nothing
    , token = Nothing
    , profile = Nothing
    , state = bytes
    }


init : { randomBytes : String } -> Url -> Key -> ( Model, Cmd Msg )
init { randomBytes } origin _ =
    let
        model =
            makeInitModel randomBytes origin
    in
    case OAuth.Implicit.parseToken (queryAsFragment origin) of
        OAuth.Implicit.Empty ->
            ( model, Cmd.none )

        OAuth.Implicit.Success { token, state } ->
            if Maybe.map randomBytesFromState state /= Just model.state then
                ( { model | error = Just "'state' doesn't match, the request has likely been forged by an adversary!" }
                , Cmd.none
                )

            else
                case Maybe.andThen (Maybe.map configurationFor << oauthProviderFromState) state of
                    Nothing ->
                        ( { model | error = Just "Couldn't recover OAuthProvider from state" }
                        , Cmd.none
                        )

                    Just config ->
                        ( { model | token = Just token }
                        , getUserInfo config token
                        )

        OAuth.Implicit.Error { error, errorDescription } ->
            ( { model | error = Just <| errorResponseToString { error = error, errorDescription = errorDescription } }
            , Cmd.none
            )


getUserInfo : OAuthConfiguration -> OAuth.Token -> Cmd Msg
getUserInfo { profileEndpoint, profileDecoder } token =
    Http.request
        { method = "GET"
        , body = Http.emptyBody
        , headers = OAuth.useToken token []
        , tracker = Nothing
        , url = Url.toString profileEndpoint
        , expect = Http.expectJson GotUserInfo profileDecoder
        , timeout = Nothing
        }


--
-- View
--

view1 : Model -> Html Msg
view1 model = view "Elm OAuth2 Example - Implicit Flow"
                { buttons =
                    [ viewSignInButton Google SignInRequested
                    , viewSignInButton Spotify SignInRequested
                    , viewSignInButton LinkedIn SignInRequested
                    ]
                , onSignOut = SignOutRequested
                }
                model


view : String -> { onSignOut : msg, buttons : List (Html msg) } -> Model -> Html msg
view title { onSignOut, buttons } model =
    let
        content =
            case ( model.token, model.profile ) of
                ( Nothing, Nothing ) ->
                    viewLogin { buttons = buttons }

                ( Just token, Nothing ) ->
                    [ viewFetching ]

                ( _, Just profile ) ->
                    [ viewProfile onSignOut profile ]
    in
        viewBody model content


viewBody : Model -> List (Html msg) -> Html msg
viewBody model content =
    div
        [ style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , style "width" "100%"
        , style "height" "98vh"
        , style "font-family" "Roboto, Arial, sans-serif"
        ]
        (viewError model.error :: content)


viewLogin : { buttons : List (Html msg) } -> List (Html msg)
viewLogin { buttons } =
    [ div
        [ style "display" "flex"
        , style "align-items" "flex-end"
        , style "justify-content" "center"
        , style "flex-direction" "column"
        ]
        buttons
    , div
        [ style "background" "#bdc3c7"
        , style "height" "10em"
        , style "width" "0.1em"
        , style "margin" "0 1em"
        ]
        []
    , div
        [ style "width" "25em"
        , style "padding" "1em 1em"
        ]
        sideNote
    ]


viewFetching : Html msg
viewFetching =
    div
        [ style "color" "#757575"
        , style "font" "Roboto Arial"
        , style "text-align" "center"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        ]
        [ text "fetching profile..." ]


viewProfile : msg -> Profile -> Html msg
viewProfile onSignOut profile =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "align-items" "center"
        , style "justify-content" "center"
        ]
        [ img
            [ src profile.picture
            , style "height" "15em"
            , style "width" "15em"
            , style "border-radius" "50%"
            , style "box-shadow" "rgba(0,0,0,0.25) 0 0 4px 2px"
            ]
            []
        , div
            [ style "margin" "2em"
            , style "font" "24px Roboto, Arial"
            , style "color" "#757575"
            ]
            [ text <| profile.name ]
        , div
            []
            [ button
                [ onClick onSignOut
                , style "font-size" "24px"
                , style "cursor" "pointer"
                , style "height" "2em"
                , style "width" "8em"
                ]
                [ text "Sign Out"
                ]
            ]
        ]


viewError : Maybe String -> Html msg
viewError error =
    case error of
        Nothing ->
            div [ style "display" "none" ] []

        Just msg ->
            div
                [ style "width" "100%"
                , style "padding" "1em"
                , style "text-align" "center"
                , style "background" "#e74c3c"
                , style "color" "#ffffff"
                , style "position" "absolute"
                , style "top" "0"
                , style "display" "block"
                , style "box-sizing" "border-box"
                ]
                [ text msg ]


viewSignInButton : OAuthProvider -> (OAuthConfiguration -> msg) -> Html msg
viewSignInButton provider onSignIn =
    button
        [ attrLogo provider
        , style "background-size" "3em"
        , style "border" "none"
        , style "box-shadow" "rgba(0,0,0,0.25) 0px 2px 4px 0px"
        , style "color" "#757575"
        , style "font-size" "24px"
        , style "outline" "none"
        , style "cursor" "pointer"
        , style "height" "3em"
        , style "width" "10em"
        , style "text-align" "right"
        , style "padding" "0 1em 0 4em"
        , style "margin" "0.5em 0"
        , onClick (onSignIn <| configurationFor provider)
        ]
        [ text "Sign in" ]


attrLogo : OAuthProvider -> Attribute msg
attrLogo provider =
    let
        data =
            case provider of
                Google ->
                    "data:image/png;base64,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"

                Spotify ->
                    "data:image/png;base64,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"

                LinkedIn ->
                    "data:image/jpeg;base64,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"
    in
    style "background" ("0 center no-repeat url('" ++ data ++ "')")



--
-- Helpers
--


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


oauthProviderToString : OAuthProvider -> String
oauthProviderToString provider =
    case provider of
        Google ->
            "google"

        Spotify ->
            "spotify"

        LinkedIn ->
            "linkedin"


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


makeState : String -> OAuthProvider -> String
makeState suffix provider =
    oauthProviderToString provider ++ "." ++ suffix


oauthProviderFromState : String -> Maybe OAuthProvider
oauthProviderFromState str =
    str
        |> stringLeftUntil (\c -> c == ".")
        |> oauthProviderFromString


randomBytesFromState : String -> String
randomBytesFromState str =
    str
        |> stringDropLeftUntil (\c -> c == ".")


stringDropLeftUntil : (String -> Bool) -> String -> String
stringDropLeftUntil predicate str =
    let
        ( h, q ) =
            ( String.left 1 str, String.dropLeft 1 str )
    in
    if q == "" || predicate h then
        q

    else
        stringDropLeftUntil predicate q


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


configurationFor : OAuthProvider -> OAuthConfiguration
configurationFor provider =
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
    case provider of
        Google ->
            { provider = Google
            , clientId = "909608474358-fkok86ks7e83c47aq01aiit47vsoh4s0.apps.googleusercontent.com"
            , secret = "<secret>"
            , authorizationEndpoint = { defaultHttpsUrl | host = "accounts.google.com", path = "/o/oauth2/v2/auth" }
            , tokenEndpoint = { defaultHttpsUrl | host = "www.googleapis.com", path = "/oauth2/v4/token" }
            , profileEndpoint = { defaultHttpsUrl | host = "www.googleapis.com", path = "/oauth2/v1/userinfo" }
            , scope = [ "profile" ]
            , profileDecoder =
                Json.map2 Profile
                    (Json.field "name" Json.string)
                    (Json.field "picture" Json.string)
            }

        Spotify ->
            { provider = Spotify
            , clientId = "391d08ef3d7a46558493cb822a991dbb"
            , secret = "<secret>"
            , authorizationEndpoint = { defaultHttpsUrl | host = "accounts.spotify.com", path = "/authorize" }
            , tokenEndpoint = { defaultHttpsUrl | host = "accounts.spotify.com", path = "/api/token" }
            , profileEndpoint = { defaultHttpsUrl | host = "api.spotify.com", path = "/v1/me" }
            , scope = []
            , profileDecoder =
                Json.map2 Profile
                    (Json.field "display_name" Json.string)
                    (Json.field "images" <| Json.index 0 <| Json.field "url" Json.string)
            }

        LinkedIn ->
            { provider = LinkedIn
            , clientId = "778vrrt6dbp865"
            , secret = "<secret>"
            , authorizationEndpoint = { defaultHttpsUrl | host = "www.linkedin.com", path = "/oauth/v2/authorization" }
            , tokenEndpoint = { defaultHttpsUrl | host = "www.linkedin.com", path = "/oauth/v2/accessToken" }
            , profileEndpoint = { defaultHttpsUrl | host = "api.linkedin.com", path = "/v2/me" }
            , scope = [ "r_basicprofile" ]
            , profileDecoder =
                Json.map2 Profile
                    (Json.field "firstName" Json.string)
                    (Json.field "pictureUrl" Json.string)
            }


sideNote : List (Html msg)
sideNote =
    [ h1 [] [ text "Implicit Flow" ]
    , p []
        [ text """
This simple demo gives an example on how to implement the OAuth-2.0
Implicit grant using Elm. This is the recommended way for most client
application as it doesn't expose any secret credentials to the end-user.
  """
        ]
    , p []
        [ text "A few interesting notes about this demo:"
        , br [] []
        , ul []
            [ li [ style "margin" "0.5em 0" ] [ text "This demo application requires basic scopes from the authorization servers in order to display your name and profile picture, illustrating the demo." ]
            , li [ style "margin" "0.5em 0" ] [ text "You can observe the URL in the browser navigation bar and requests made against the authorization servers!" ]
            , li [ style "margin" "0.5em 0" ] [ text "The LinkedIn implemention doesn't work as LinkedIn only supports the 'Authorization Code' grant. Though, the button is still here to show an example of error path." ]
            ]
        ]
    ]

--
-- Hacks
--


queryAsFragment : Url -> Url
queryAsFragment url =
    case url.fragment of
        Just "_=_" ->
            { url | fragment = url.query, query = Nothing }

        Nothing ->
            { url | fragment = url.query, query = Nothing }

        _ ->
            url