module Logout exposing (..)

import Browser
import Browser.Navigation as Navigation exposing (..)
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
import OAuth
import OAuth.Implicit exposing (defaultParsers)
import Url exposing (Protocol(..), Url)
import Url.Parser.Query as Query
import Json.Decode as Json

import RemoteData exposing (RemoteData, WebData, succeed)

import Bootstrap.CDN as CDN
import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block

import Session exposing (..)
import Utils exposing (..)


type Msg =
    Logout


view : Html Msg
view = div [ class "container" ]
    [ h1 [] [ text "Logout" ]
        , p [] [ text "Goodbye, hope to see you soon."
               ]
        , p [] [ Button.button
                [ Button.primary, Button.onClick Logout ]
                [ text "Logout" ]
            ]
    ]


logoutUri : Session -> String
logoutUri session = Session.getThisBaseUrlString session


update : Msg -> Session -> ( Session, Cmd Msg )
update msg session =
    case msg of
        Logout ->
            ( session
            , Navigation.load (logoutUri session)
            )

