module Menu exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

-- import Route exposing (..)

import Bootstrap.Navbar as Navbar

import Session exposing (..)


initialState : (Navbar.State, Cmd Msg)
initialState =
    Navbar.initialState NavbarMsg


type alias MenuAction =
    { title : String
    , description : String
    , imageLink : String
    , page : Page
    -- , isAcive : Bool
    }


type Msg
    = NavbarMsg Navbar.State
    | ChangedPage Page


menuActionsNoAccessToken : List MenuAction
menuActionsNoAccessToken =
    [
        {
            title = "Login"
            , description = "You must log in to use the library"
            , imageLink = ""
            , page = LoginPage
        }
    ]


menuActionsWithAccessToken : List MenuAction
menuActionsWithAccessToken =
    [
        {
            title = "Add books"
            , description = "Add books to the library"
            , imageLink = ""
            , page = BookSelectorPage
        }
        , {
            title = "Library"
            , description = "Checkout books from the library"
            , imageLink = ""
            , page = LibraryPage
        }
        , {
            title = "Checkin"
            , description = "Return books to the library"
            , imageLink = ""
            , page = CheckinPage
        }
        , {
            title = "Your books"
            , description = "Administer your books in the library"
            , imageLink = ""
            , page = BooksEditorPage
        }
        , {
            title = "Logout"
            , description = "Say goodbye"
            , imageLink = ""
            , page = LogoutPage
        }
    ]

--
-- VIEW
--

view : Session -> Html Msg
view session =
        Navbar.config NavbarMsg
            |> Navbar.withAnimation
            |> Navbar.collapseMedium
            |> Navbar.brand [ onClick (ChangedPage Session.WelcomePage) ] [ img [ src "src/resources/readingOwl_small.png", class "d-inline-block align-top", style  "width" "64px"  ] [ text "Lunatech" ] ]
            |> Navbar.items
                ( case session.token of
                    Nothing ->
                        List.map (viewActionCard session) menuActionsNoAccessToken

                    Just token ->
                        List.map (viewActionCard session) menuActionsWithAccessToken
                )
        |> Navbar.view session.navbarState

viewActionCard : Session -> MenuAction -> Navbar.Item Msg
viewActionCard session menuAction =
    let
        menuActionIsActive = session.page == menuAction.page 
    in
        case menuActionIsActive of
            True ->
                Navbar.itemLinkActive [ onClick (ChangedPage menuAction.page)  ] [ text menuAction.title ]
            False ->
                Navbar.itemLink [ onClick (ChangedPage menuAction.page)  ] [ text menuAction.title ]


update : Msg -> Session -> ( Session, Cmd Msg )
update msg session =
    case msg of
        NavbarMsg state ->
            ( { session | navbarState = state }, Cmd.none )

        -- ChangedPage page ->
        --    ( model, Cmd.none )
        ChangedPage page ->
            ( changedPageSession page session, Cmd.none )


subscriptions : Session -> Sub Msg
subscriptions session =
    Navbar.subscriptions session.navbarState NavbarMsg