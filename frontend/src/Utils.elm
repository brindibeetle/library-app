module Utils exposing (..)

import Url exposing (Protocol(..), Url)
import Time
import Http

libraryApiBaseUrl : String
libraryApiBaseUrl = "http://localhost:8080/api/v1"

myBaseUri : Url
myBaseUri = 
    { protocol = Http
    , host = "localhost"
    , path = ""
    , port_ = Just 8000
    , query = Nothing
    , fragment = Nothing
    }

languages : List (String, String)
languages = [ ("",""), ("en", "English"), ("nl", "Nederlands"), ("fr", "Français") ]

locations : List (String, String)
locations = [ ("", ""), ("am", "Amsterdam"), ("ro", "Rotterdam"), ("br", "Bruxelles"), ("ch", "Chessy"), ("home", "At home") ]



toWeekday : Time.Weekday -> String
toWeekday weekday =
    case weekday of
        Time.Mon -> "Monday"
        Time.Tue -> "Tuesday"
        Time.Wed -> "Wednesday"
        Time.Thu -> "Thursday"
        Time.Fri -> "Friday"
        Time.Sat -> "Saturday"
        Time.Sun -> "Sunday"


toMonth : Time.Month -> String
toMonth month = 
    case month of
        Time.Jan -> "januari"
        Time.Feb -> "februari"
        Time.Mar -> "march"
        Time.Apr -> "april"
        Time.May -> "may"
        Time.Jun -> "june"
        Time.Jul -> "july"
        Time.Aug -> "august"
        Time.Sep -> "september"
        Time.Oct -> "oktober"
        Time.Nov -> "november"
        Time.Dec -> "december"


getTimeZone : Time.Zone
getTimeZone = 
    Time.utc


getNiceTime : Time.Posix -> String
getNiceTime datetime = 
    (
        Time.toWeekday getTimeZone datetime
        |> toWeekday
    )
    ++ " " ++ 
    (
        Time.toDay getTimeZone datetime
        |> String.fromInt
    )
    ++ " " ++
    (
        Time.toMonth getTimeZone datetime
        |> toMonth
    )
    ++ " " ++
    (
        Time.toYear getTimeZone datetime
        |> String.fromInt
    )



buildErrorMessage : Http.Error -> String
buildErrorMessage httpError =
    case httpError of
        Http.BadUrl message ->
            message

        Http.Timeout ->
            "Server is taking too long to respond. Please try again later."

        Http.NetworkError ->
            "Unable to reach server."

        Http.BadStatus statusCode ->
            "Request failed with status code: " ++ String.fromInt statusCode

        Http.BadBody message ->
            message