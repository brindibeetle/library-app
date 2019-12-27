module Utils exposing (..)

import Url exposing (Protocol(..), Url)
import Time
import Http
import Bootstrap.Form.Select as Select exposing (..)
import Html.Attributes exposing (..)
import Html exposing (..)
import Dict exposing (..)

-- libraryApiBaseUrl : String
-- libraryApiBaseUrl = "http://localhost:8080/api/v1"

-- myBaseUri : Url
-- myBaseUri = 
--     { protocol = Http
--     , host = "localhost"
--     , path = ""
--     , port_ = Just 8000
--     , query = Nothing
--     , fragment = Nothing
--     }

checkedStatusList : Dict String String
checkedStatusList = Dict.fromList [ ("available", "Available books"), ("checkedout", "Checked out books") ]

languages : List (String, String)
languages = [ ("",""), ("en", "English"), ("nl", "Nederlands"), ("fr", "Français") ]

locations : List (String, String)
locations = [ ("", ""), ("am", "Amsterdam"), ("ro", "Rotterdam"), ("br", "Bruxelles"), ("ch", "Chessy"), ("home", "At home") ]

lookup : String -> List (String, String) -> String
lookup key list =
    List.filter (\(key1, value) -> key1 == key ) list
    |> List.head 
    |> Maybe.map Tuple.second
    |> Maybe.withDefault key 

-- appClientId : String
-- appClientId = "937704847273-2ctk7g4e2qshu89gqch4at5qskqdus8n.apps.googleusercontent.com" -- libary-api-frontend / Webclient 2

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


