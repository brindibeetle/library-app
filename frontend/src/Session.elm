module Session exposing (..)

import OAuth
import SearchBook exposing (..)
import Bootstrap.Navbar as Navbar



type alias Session =
    { token : Maybe OAuth.Token
    , page : Page
    , navbarState : Navbar.State 
    , message : Message
    }

type Message =
    Empty
    | Succeeded String
    | Warning String
    | Error String
    

initialSession : Maybe OAuth.Token -> Navbar.State -> Session
initialSession token navbarState =
    { token = token
    , page = LandingPage
    , navbarState = navbarState
    , message = Empty
    }


changedPageSession : Page -> Session ->  Session
changedPageSession page session =
    { session
    | page = page }


tokenToString : Maybe OAuth.Token -> String 
tokenToString maybeToken =
    case maybeToken of
        Just token ->
            "<TOKEN>"
    
        Nothing ->
            ".. nothing .."
            

type Page
    = LandingPage
    | BookSelectorPage 
    | LoginPage
    | BookSelectorDetailPage
    | LibraryPage


toString : Page -> String
toString page =
    case page of
        LandingPage ->
            "NotFoundPage"

        BookSelectorPage ->
            "BookSelectorPage"

        LoginPage ->
            "LoginPage"

        BookSelectorDetailPage ->
            "BookSelectorDetailPage"

        LibraryPage ->
            "LibraryPage"
    