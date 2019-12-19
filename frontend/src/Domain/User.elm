module Domain.User exposing (..)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)
import RemoteData exposing (RemoteData, WebData, succeed)

import GoogleBookApi as Api exposing (..)


type alias User = 
    {
        name : String
        , email : String
        , picture : String
    }


-- Opaque
emptyUser : User
emptyUser =
    {
        name = ""
        , email = ""
        , picture = ""
    }


-- Opaque
userDecoder : Decoder User
userDecoder =
    Decode.succeed User
        |> required "name" string
        |> required "email" string
        |> optional "picture" string ""


