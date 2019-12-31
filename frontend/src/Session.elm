module Session exposing (..)

import OAuth
import Bootstrap.Navbar as Navbar
import RemoteData exposing (RemoteData, WebData, succeed)

import Domain.User as User
import Domain.UserInfo as UserInfo
import Domain.InitFlags exposing (..) 
import Url exposing (Url)

type alias Session =
    { token : Maybe OAuth.Token
    , user : WebData User.User
    , userInfo : WebData UserInfo.UserInfo
    , page : Page
    , navbarState : Navbar.State 
    , message : Message
    , initFlags : InitFlags
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
            
            
initialSession : Maybe OAuth.Token -> Navbar.State -> InitFlags -> Session
initialSession token navbarState initFlags =
    { token = token
    , user = RemoteData.NotAsked
    , userInfo = RemoteData.NotAsked
    , page = WelcomePage
    , navbarState = navbarState
    , message = Empty
    , initFlags = initFlags
    }

succeed : Session -> String -> Session
succeed session message =
    { session 
    | message = Succeeded message
    , page = WelcomePage }

succeed1 : Session -> String -> Session
succeed1 session message =
    { session 
    | message = Succeeded message
    , page = WelcomePage
    , userInfo = RemoteData.NotAsked }

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
    | CheckinPage
    | BookEditorPage


getGoogleClientId : Session -> String
getGoogleClientId session =
    session.initFlags.googleClientId

getLibraryApiBaseUrlString : Session -> String
getLibraryApiBaseUrlString session =
    session.initFlags.libraryApiBaseUrlString

getThisBaseUrlString : Session -> String
getThisBaseUrlString session =
    session.initFlags.thisBaseUrlString


getLibraryApiBaseUrl : Session -> Url
getLibraryApiBaseUrl session =
    case Url.fromString (getLibraryApiBaseUrlString session) of
        Just url ->
            url
    
        Nothing ->
            { protocol = Url.Http
            , host = "NOT GOOD.URL"
            , port_ = Nothing
            , path = ""
            , query = Nothing
            , fragment = Nothing
            }
    


getThisBaseUrl : Session -> Url
getThisBaseUrl session =
    case Url.fromString (getThisBaseUrlString session) of
        Just url ->
            url
    
        Nothing ->
            { protocol = Url.Http
            , host = "NOT GOOD.URL"
            , port_ = Nothing
            , path = ""
            , query = Nothing
            , fragment = Nothing
            }
