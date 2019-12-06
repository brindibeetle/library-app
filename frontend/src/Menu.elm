module Menu exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
import Browser.Navigation as Navigation

import Route exposing (..)

import OAuth
import RemoteData exposing (RemoteData, WebData, succeed)

import MyError exposing (buildErrorMessage)

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
import Bootstrap.Navbar as Navbar

import SearchBook as SearchBook


type alias Model = 
    {
        token : Maybe OAuth.Token
        , active : Maybe Msg
        , navbarState : Navbar.State 
    }

initialState : (Maybe OAuth.Token ) -> (Model, Cmd Msg)
initialState maybeToken =
    let
        ( navbarState, navbarCmd )
            = Navbar.initialState NavbarMsg
    in
    ( 
        { token = maybeToken
        , active = Nothing 
        , navbarState = navbarState
        }
        , navbarCmd
    )


type alias MenuAction =
    { title : String
    , description : String
    , imageLink : String
    , msg : Msg
    -- , isAcive : Bool
    }


type Msg
    = Login
    | BookSelector
    | NavbarMsg Navbar.State


menuActionsNoAccessToken : List MenuAction
menuActionsNoAccessToken =
    [
        {
            title = "Login"
            , description = "You must log in to use the library"
            , imageLink = ""
            , msg = Login
        }
        , {
            title = "Login"
            , description = "You must log in to use the library"
            , imageLink = ""
            , msg = Login
        }
        , {
            title = "Login"
            , description = "You must log in to use the library"
            , imageLink = ""
            , msg = Login
        }
    ]

menuActionsWithAccessToken : List MenuAction
menuActionsWithAccessToken =
    [
        {
            title = "Book selector"
            , description = "Add (new) books to the library"
            , imageLink = ""
            , msg = BookSelector
        }
        , {
            title = "Book selector"
            , description = "Add (new) books to the library"
            , imageLink = ""
            , msg = BookSelector
        }    
        , {
            title = "Book selector"
            , description = "Add (new) books to the library"
            , imageLink = ""
            , msg = BookSelector
        }    
        , {
            title = "Book selector"
            , description = "Add (new) books to the library"
            , imageLink = ""
            , msg = BookSelector
        }    
        , {
            title = "Book selector"
            , description = "Add (new) books to the library"
            , imageLink = ""
            , msg = BookSelector
        }    

    ]

--
-- VIEW
--

view : Model -> Html Msg
view model =
        Navbar.config NavbarMsg
            |> Navbar.withAnimation
            |> Navbar.collapseMedium
            |> Navbar.brand [] [ img [ src "src/resources/lunatech_logo.png", class "d-inline-block align-top", style  "width" "200px"  ] [ text "Lunatech" ] ]
            |> Navbar.items
                ( case model.token of
                    Nothing ->
                        List.map (viewActionCard model) menuActionsNoAccessToken

                    Just token ->
                        List.map (viewActionCard model) menuActionsWithAccessToken
                )
        |> Navbar.view model.navbarState

viewActionCard : Model -> MenuAction -> Navbar.Item Msg
viewActionCard model menuAction =
    let
        menuActionIsActive =
            case ( model.active, menuAction.msg ) of
                (Just msg1, msg2) ->
                    msg1 == msg2
                (_, _) ->
                    False
    in
        case menuActionIsActive of
            True ->
                Navbar.itemLinkActive [ onClick menuAction.msg ] [ text menuAction.title ]
            False ->
                Navbar.itemLink [ onClick menuAction.msg ] [ text menuAction.title ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NavbarMsg state ->
            ( { model | navbarState = state }, Cmd.none )

        Login ->
           ( 
               { model
               | active = Just Login
               }
           , Cmd.none )

        BookSelector ->
           ( 
               { model
               | active = Just BookSelector
               }
           , Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Navbar.subscriptions model.navbarState NavbarMsg