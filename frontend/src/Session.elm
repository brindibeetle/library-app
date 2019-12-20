module Session exposing (..)

import OAuth
import Bootstrap.Navbar as Navbar
import RemoteData exposing (RemoteData, WebData, succeed)

import Domain.User as User


type alias Session =
    { token : Maybe OAuth.Token
    , user : WebData User.User
    , page : Page
    , navbarState : Navbar.State 
    , message : Message
    }


type Message =
    Empty
    | Succeeded String
    | Warning String
    | Error String


getUser : Session -> String
getUser session =
    case session.user of
        RemoteData.Success user1 ->
            user1.email
    
        _ ->
            "Not found"
            
            
initialSession : Maybe OAuth.Token -> Navbar.State -> Session
initialSession token navbarState =
    { token = token
    , user = RemoteData.NotAsked
    , page = WelcomePage
    , navbarState = navbarState
    , message = Empty
    }

succeed : Session -> String -> Session
succeed session message =
    { session 
    | message = Succeeded message
    , page = WelcomePage }

fail : Session -> String -> Session
fail session message =
    { session 
    | message = Error message
    , page = WelcomePage }


warn : Session -> String -> Session
warn session message =
    { session 
    | message = Warning message
    , page = WelcomePage }


changedPageSession : Page -> Session ->  Session
changedPageSession page session =
    { session
    | page = page
    , message = Empty
    }


tokenToString : Maybe OAuth.Token -> String 
tokenToString maybeToken =
    case maybeToken of
        Just token ->
            "<TOKEN>"
    
        Nothing ->
            ".. nothing .."


type Page
    = WelcomePage
    | LoginPage
    | LogoutPage
    | BookSelectorPage 
    | LibraryPage


toString : Page -> String
toString page =
    case page of
        WelcomePage ->
            "WelcomePage"

        LoginPage ->
            "LoginPage"

        LogoutPage ->
            "LogoutPage"

        BookSelectorPage ->
            "BookSelectorPage"

        LibraryPage ->
            "LibraryPage"
    