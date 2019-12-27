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
import Session exposing (..)

libraryApiCheckoutsUrl : Session -> String
libraryApiCheckoutsUrl session =
    Session.getLibraryApiBaseUrlString session ++ "/checkouts"

libraryApiCheckoutsCurrentUrl : Session -> String
libraryApiCheckoutsCurrentUrl session =
    Session.getLibraryApiBaseUrlString session ++ "/checkouts/current"

libraryApiCheckoutsCurrentMineUrl : Session -> String
libraryApiCheckoutsCurrentMineUrl session =
    Session.getLibraryApiBaseUrlString session ++ "/checkouts/current/mine"

libraryApiCheckoutUrl : Session -> Int -> String
libraryApiCheckoutUrl session bookId =
    Session.getLibraryApiBaseUrlString session ++ "/checkout/" ++ String.fromInt bookId

libraryApiCheckinUrl : Session -> Int -> String
libraryApiCheckinUrl session bookId =
    Session.getLibraryApiBaseUrlString session ++ "/checkin/" ++ String.fromInt bookId

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


getCheckouts : (WebData (Array Checkout) -> msg) -> Session -> OAuth.Token  -> Cmd msg
getCheckouts msg session token  =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckoutsUrl session) ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect = 
                checkoutsDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }

getCheckoutsCurrent : (WebData (Array Checkout) -> msg) -> Session -> OAuth.Token ->  Cmd msg
getCheckoutsCurrent msg session token =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckoutsCurrentUrl session) ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect =  
                checkoutsDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }

getCheckoutsCurrentMine : (WebData (Array Checkout) -> msg) -> Session -> OAuth.Token ->  Cmd msg
getCheckoutsCurrentMine msg session token =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckoutsCurrentMineUrl session) ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect =  
                checkoutsDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }

doCheckout : (Result Http.Error () -> msg) -> Session -> OAuth.Token -> Int -> Cmd msg
doCheckout msg session token bookId =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckoutUrl session bookId) ++ "?access_token=" ++ puretoken
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

doCheckin : (Result Http.Error () -> msg) -> Session -> OAuth.Token -> Int -> Cmd msg
doCheckin msg session token bookId =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" (libraryApiCheckinUrl session bookId) ++ "?access_token=" ++ puretoken
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


