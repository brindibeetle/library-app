module Domain.Checkout exposing (..)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)
import Time

import Http exposing (..)
import OAuth

import Json.Decode.Extra as Extra

import RemoteData exposing (RemoteData, WebData, succeed)

import Utils exposing (..)

libraryApiCheckoutsUrl : String
libraryApiCheckoutsUrl =
    libraryApiBaseUrl ++ "/checkouts"

libraryApiCheckoutsCurrentUrl : String
libraryApiCheckoutsCurrentUrl =
    libraryApiBaseUrl ++ "/checkouts/current"

libraryApiCheckoutUrl : Int -> String
libraryApiCheckoutUrl bookId =
    libraryApiBaseUrl ++ "/checkout/" ++ String.fromInt bookId

type alias Checkout = 
    {
        id : Int
        , bookId : Int
        , dateTimeFrom : Time.Posix
        , dateTimeTo : Time.Posix
        , userEmail : String
    }


-- Opaque
emptyCheckout : Checkout
emptyCheckout =
    {
        id = 0
        , bookId = 0
        , dateTimeFrom = Time.millisToPosix 0
        , dateTimeTo = Time.millisToPosix 0
        , userEmail = ""
    }


getCheckouts : OAuth.Token -> (WebData (Array Checkout) -> msg) -> Cmd msg
getCheckouts token msg =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" libraryApiCheckoutsUrl ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect = 
                checkoutsDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }

getCheckoutsCurrent : OAuth.Token -> (WebData (Array Checkout) -> msg) -> Cmd msg
getCheckoutsCurrent token msg =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" libraryApiCheckoutsCurrentUrl ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect =  
                checkoutsDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }

doCheckout : OAuth.Token -> (Result Http.Error () -> msg) -> Int -> Cmd msg
doCheckout token msg bookId =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckoutUrl bookId) ++ "?access_token=" ++ puretoken
    in
        Http.request
            { method = "PUT"
            , headers = []
            , url = requestUrl
            , body = emptyBody
            , expect = Http.expectWhatever msg
            , timeout = Nothing
            , tracker = Nothing
            }


checkoutsDecoder : Decoder (Array Checkout)
checkoutsDecoder =
    Decode.array checkoutDecoder


checkoutDecoder : Decoder Checkout
checkoutDecoder =
    Decode.succeed Checkout
        |> required "id" int
        |> required "bookId" int
        |> required "dateTimeFrom" Extra.datetime
        |> optional "dateTimeTo" Extra.datetime (Time.millisToPosix 0)
        |> required "userEmail" string


