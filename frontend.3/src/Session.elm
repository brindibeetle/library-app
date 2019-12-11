module Session exposing (..)

import Page exposing (..)
import OAuth
import SearchBook exposing (..)
import Bootstrap.Navbar as Navbar



type alias Session =
    { token : Maybe OAuth.Token
    , page : Page
    , navbarState : Navbar.State 
    , error : Maybe String
    }


initialSession : Maybe OAuth.Token -> Navbar.State -> Session
initialSession token navbarState =
    { token = token
    , page = Landing
    , navbarState = navbarState
    , error = Nothing
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
            

toString : Session -> String
toString session =
    """{
         token = """ ++ tokenToString session.token ++ """
         page = """ ++ Page.toString session.page ++ """
         error = """ ++ (Maybe.withDefault ".. nothing .." session.error)
                 
