module Domain.UserInfo exposing (UserInfo, userInfoDecoder)

import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)


type alias UserInfo = 
    {
        name : String
        , numberBooks : Int
        , numberCheckouts : Int

    }


-- Opaque
emptyUserInfo : UserInfo
emptyUserInfo =
    {
        name = ""
        , numberBooks = 0
        , numberCheckouts = 0
    }


userInfoDecoder : Decoder UserInfo
userInfoDecoder =
    Decode.succeed UserInfo
        |> required "name" string
        |> optional "numberBooks" int 0
        |> optional "numberCheckouts" int 0

