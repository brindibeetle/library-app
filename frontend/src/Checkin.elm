module Checkin exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Domain.Checkout exposing (..)
import Domain.Book exposing (..)
import Utils exposing (..)
import Library as Library exposing (..)

import Css exposing (..)


type Model = 
    Library Library.Model

toModel : Model -> Library.Model
toModel model =
    case model of
        Library libraryModel ->
            libraryModel


-- type BookView =
--     Tiles
--     | Details Int
--     | Checkout Int
--     | CheckoutDone Int


initialModel : String -> Model
initialModel userEmail =
    Library (Library.initialModel userEmail)


initialModelCmd : Session -> ( Model, Cmd Msg )
initialModelCmd session1 =
    let
        { model, session, cmd } = Library.doSearch ( Library.initialModel (Session.getUser session1)) session1
    in
        ( Library model, Cmd.map LibraryMsg cmd )
    


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    Library.view (toModel model) |> Html.map LibraryMsg

-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        LibraryMsg Library.Msg



update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case (msg, model) of
        ( LibraryMsg subMsg, Library libraryModel ) ->
            let
                libraryUpdated =
                    Library.update subMsg libraryModel session
            in
                { model = Library libraryUpdated.model, session = session, cmd = (libraryUpdated.cmd |> Cmd.map LibraryMsg) }
    
