module Checkin exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Domain.Checkout exposing (..)
import Utils exposing (..)
import Library as Library exposing (..)
import View.LibraryTiles as Tiles exposing (..)

import Css exposing (..)


type Model = 
    Library Library.Model



initialModel : String -> Model
initialModel userEmail =
    Library (Library.initialModel userEmail)
    |> model2Checkin


model2Checkin : Model -> Model
model2Checkin model =
    let
        libraryModel = toModel model
        booktiles = libraryModel.booktiles
        userEmail = booktiles.userEmail
    in
        Library 
        { libraryModel 
        | booktiles = booktiles
            |>  Tiles.setShowSearch { title = False, authors = False, location = False, owner = False, checkStatus = False, checkoutUser = False }
            |> setSearch { title = "", authors = "", location = "", owner = "", checkStatus = "checkedout", checkoutUser = userEmail } 
        }


initialModelCmd : Session -> ( Model, Cmd Msg )
initialModelCmd session1 =
    let
        ( booktiles, cmd ) = LibraryTiles.initialModelCmd session1 
        model = initialModel (getUser session1)
        model1 = 
            { model
            | booktiles = booktiles 
                |> Tiles.setShowSearch 
                    { title = False
                    , authors = False
                    , location = False
                    , owner = False
                    , checkStatus = False
                    , checkoutUser = False
                    }
                |> Tiles.setSearch 
                    { title = ""
                    , authors = ""
                    , location = ""
                    , owner = ""
                    , checkStatus = "checkedout"
                    , checkoutUser = userEmail
                    } 
            }
    in
        ( model1, cmd |> Cmd.map LibraryTilesMsg )
    


toModel : Model -> Library.Model
toModel model =
    case model of
        Library libraryModel ->
            libraryModel


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
                { model = Library libraryUpdated.model, session = libraryUpdated.session, cmd = (libraryUpdated.cmd |> Cmd.map LibraryMsg) }
    
