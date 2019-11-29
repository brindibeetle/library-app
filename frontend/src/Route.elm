module Route exposing (Route(..), parseUrl, pushUrl)

import Url exposing (Url)
import Url.Parser as Parser exposing (..)
import Browser.Navigation as Nav

type Route
    = NotFound
    | BookSelector

parseUrl : Url -> Route
parseUrl url =
    case parse matchRoute url of
        Just route ->
            route

        Nothing ->
            NotFound


matchRoute : Parser (Route -> a) a
matchRoute =
    oneOf
        [ 
          Parser.map BookSelector (s "bookselector")
        ]


pushUrl : Route -> Nav.Key -> Cmd msg
pushUrl route navKey =
    routeToString route
        |> Nav.pushUrl navKey


routeToString : Route -> String
routeToString route =
    case route of
        NotFound ->
            "/not-found"

        BookSelector ->
            "/bookselector"