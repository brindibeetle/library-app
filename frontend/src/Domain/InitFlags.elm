module Domain.InitFlags exposing (..)

import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
import Json.Encode as Encode

import Utils exposing (..)

type alias InitFlags = 
    {
        googleClientId : String
        , libraryApiBaseUrlString : String
        , thisBaseUrlString : String
    }

-- Opaque
emptyInitFlags : InitFlags
emptyInitFlags =
    {
        googleClientId = ""
        , libraryApiBaseUrlString = ""
        , thisBaseUrlString = ""
    }


initFlagsBookDecoder : Decode.Decoder InitFlags
initFlagsBookDecoder =
    Decode.succeed InitFlags
        |> required "google_oauth2_client_id" string
        |> required "library_api_base_url" string
        |> required "this_base_url" string



getInitFlags : String -> InitFlags
getInitFlags dvalue =
    case Decode.decodeString initFlagsBookDecoder dvalue  of

        Result.Ok initFlags ->
            let
                r = Debug.log "InitFlags.getInitFlags OK" initFlags
            in
                initFlags
    
        Result.Err a ->
            let
                r = Debug.log "InitFlags.getInitFlags Err" a
            in
                emptyInitFlags
    