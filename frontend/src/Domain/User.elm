module Domain.User exposing (User, userDecoder)

import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)


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


userDecoder : Decoder User
userDecoder =
    Decode.succeed User
        |> required "name" string
        |> required "email" string
        |> optional "picture" string ""


