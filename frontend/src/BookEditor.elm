module BookEditor exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)

import Http as Http

import RemoteData exposing (WebData)

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Domain.Checkout exposing (..)
import Utils exposing (..)

import Css exposing (..)

import View.LibraryTiles as LibraryTiles exposing (..)
import View.LibraryDetails as LibraryDetails exposing (..)
import View.LibraryEdit as LibraryEdit exposing (..)

type alias Model = 
    {
        librarybooks : WebData (Array LibraryBook)
        , checkouts : WebData (Array Checkout)
        , bookView : BookView
        , booktiles : LibraryTiles.Config 
        , bookdetails : LibraryDetails.Config Msg
        , bookedit : LibraryEdit.Config
    }


type BookView =
    Tiles
    | Details Int
    | ConfirmDelete Int
    | Update Int
    | ConfirmUpdate Int
    | DoActionDone Int


initialModel : String -> Model
initialModel userEmail =
    { librarybooks = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , bookView = Tiles
    , booktiles = LibraryTiles.intialConfig userEmail
    , bookdetails = 
        { userEmail = userEmail
        , doAction1 = { msg = DoDelete, text = "Delete", disabled = False, visible = True }
        , doAction2 = { msg = DoUpdate, text = "Update", disabled = False, visible = True }
        , remarks = ""
        , doPrevious = DoPrevious
        , doNext = DoNext
        , doCancel = DoCancel
        , libraryBook = emptyLibrarybook
        , maybeCheckout = Nothing
        , hasPrevious = False
        , hasNext = False
        }
    , bookedit = { book = emptyLibrarybook, doInsert = { visible = False}, doUpdate  = {visible = True }}
    }


initialModelCmd : Session -> ( Model, Cmd Msg )
initialModelCmd session1 =
    let
        userEmail = Session.getUser session1
        ( booktiles, cmd ) = LibraryTiles.initialModelCmd session1 
        model = initialModel (getUser session1)
        model1 = 
            { model
            | booktiles = booktiles 
                |> LibraryTiles.setShowSearch 
                    { title = True
                    , authors = True
                    , location = True
                    , owner = False
                    , checkStatus = False
                    , checkoutUser = False
                    }
                |> LibraryTiles.setSearch 
                    { title = ""
                    , authors = ""
                    , location = ""
                    , owner = userEmail
                    , checkStatus = ""
                    , checkoutUser = ""
                    } 
            }
    in
        ( model1, cmd |> Cmd.map LibraryTilesMsg )


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.bookView of
        Tiles ->
            LibraryTiles.view model.booktiles |> Html.map LibraryTilesMsg
            
        Details index ->
            viewDetails index model

        Update index ->
            LibraryEdit.view model.bookedit |> Html.map LibraryEditMsg

        ConfirmDelete index ->
            viewConfirmDelete index model

        ConfirmUpdate index ->
            viewConfirmUpdate index model

        DoActionDone index ->
            LibraryDetails.view model.bookdetails


viewDetails : Int -> Model -> Html Msg
viewDetails index model =
    let
        bookdetails = model.bookdetails
    in
        case bookdetails.maybeCheckout of
            Just checkout ->
                LibraryDetails.view  
                    { bookdetails
                    | doAction1 = { msg = DoDelete, text = "Delete", disabled = True, visible = True }
                    , doAction2 = { msg = DoUpdate, text = "Edit", disabled = False, visible = True }
                    , remarks = "This book is checked out by " ++ checkout.userEmail ++ "."
                    }

            Nothing ->
                LibraryDetails.view  
                    { bookdetails
                    | doAction1 = { msg = DoDelete, text = "Delete", disabled = False, visible = True }
                    , doAction2 = { msg = DoUpdate, text = "Edit", disabled = False, visible = True }
                    , remarks = ""
                    }


viewConfirmDelete : Int -> Model -> Html Msg
viewConfirmDelete index model =
    let
        bookdetails = model.bookdetails
    in
        LibraryDetails.view  
            { bookdetails
            | doAction1 = { msg = DoDeleteConfirm, text = "Confirm", disabled = False, visible = True }
            , doAction2 = { msg = DoUpdate, text = "Edit", disabled = False, visible = False }
            , remarks = "Please confirm that the book will be removed from the library."
            }


viewConfirmUpdate : Int -> Model -> Html Msg
viewConfirmUpdate index model =
    let
        bookdetails = model.bookdetails
    in
        LibraryDetails.view  
            { bookdetails
            | doAction1 = { msg = DoUpdateConfirm, text = "Confirm", disabled = False, visible = True }
            , doAction2 = { msg = DoUpdate, text = "Edit", disabled = False, visible = False }
            , remarks = "Please confirm that the book will be updated in the library."
            }


-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        LibraryTilesMsg LibraryTiles.Msg
        | LibraryEditMsg LibraryEdit.Msg
        | DoNext
        | DoPrevious
        | DoCancel
        | DoUpdate
        | DoDelete
        | DoUpdateConfirm
        | DoDeleteConfirm
        | DoUpdated (Result Http.Error LibraryBook)
        | DoDeleted (Result Http.Error String)



update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg1 model1 session1 =
    let
        a = Debug.log "update msg = " msg1
        -- a1 = Debug.log "update model.searchTitle = " model.searchTitle
        -- a2 = Debug.log "update msg = " msg
    in

    case model1.bookView of
        Tiles ->
            case msg1 of
                LibraryTilesMsg (DoDetail index) ->
                    { model = doIndex model1 index
                    , session = session1
                    , cmd = Cmd.none
                    }

                LibraryTilesMsg subMsg ->
                    let
                        { model, session, cmd } = LibraryTiles.update subMsg model1.booktiles session1
                        model2 = 
                            { model1
                            | booktiles = model
                            }
                    in
                        { model = model2, session = session, cmd = cmd |> Cmd.map LibraryTilesMsg }

                _ ->
                    { model = model1, session = session1, cmd = Cmd.none }

        Details index ->
            updateDetails msg1 model1 session1 index

        Update index ->
            case msg1 of
                LibraryEditMsg LibraryEdit.DoCancel ->
                    { model = doIndex model1 index
                    , session = session1
                    , cmd = Cmd.none
                    }
                     
                LibraryEditMsg subMsg ->
                    let
                        { model, session, cmd } = LibraryEdit.update subMsg model1.bookedit session1
                        model2 = 
                            { model1
                            | bookedit = model
                            }
                    in
                        { model = model2, session = session, cmd = cmd |> Cmd.map LibraryEditMsg }

                _ ->
                    { model = model1, session = session1, cmd = Cmd.none }

        ConfirmDelete index ->
            updateConfirm msg1 model1 session1 index

        ConfirmUpdate index ->
            updateConfirm msg1 model1 session1 index

        DoActionDone index ->
            updateDoActionDone msg1 model1 session1 index

            
updateDetails : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDetails msg model session index =
    case msg of
        DoPrevious ->
            { model = doIndex model (index - 1)
            , session = session
            , cmd = Cmd.none }

        DoNext ->
            { model = doIndex model (index + 1)
            , session = session
            , cmd = Cmd.none }

        DoCancel ->
            { model = 
                { model 
                | bookView = Tiles
                }
                , session = session, cmd = Cmd.none }
        
        DoDelete ->
            { model = doAction model index |> setBookView (ConfirmDelete index)
            , session = session
            , cmd = Cmd.none }

        DoUpdate ->
            { model = doAction model index |> setBookView (Update index) |> setEditBook model.bookdetails.libraryBook
            , session = session
            , cmd = Cmd.none }

        _ ->            
            { model = model, session = session, cmd = Cmd.none }


updateConfirm : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateConfirm msg model session index =
    case msg of
        DoCancel ->
            { model = doActionCancel (doIndex model index) index
                , session = session, cmd = Cmd.none }

        DoDeleteConfirm ->
            case session.token of
                Just token ->
                    { model = doActionDone model index
                    , session = session
                    , cmd = Domain.LibraryBook.delete DoDeleted session token model.bookdetails.libraryBook }

                _ ->
                    { model = model, session = session, cmd = Cmd.none }
            
        -- DoUpdateConfirm ->
        --     case session.token of
        --         Just token ->
        --             { model = doActionDone model index
        --             , session = session
        --             , cmd = Domain.LibraryBook.update DoUpdated session token model.bookdetails.libraryBook }

        --         _ ->
        --             { model = model, session = session, cmd = Cmd.none }
            
        _ ->
            { model = model, session = session, cmd = Cmd.none }


updateDoActionDone : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDoActionDone msg model session index =
    case msg of
        DoDeleted ( Result.Ok result ) ->
            { model = model
            , session = Session.succeed session ("The book \"" ++ model.bookdetails.libraryBook.title ++ "\" has been deleted from the library!")
            , cmd = Cmd.none }

        DoDeleted ( Result.Err error ) ->
            { model = model
            , session = Session.fail session ("The book has NOT been deleted : " ++ buildErrorMessage error)
            , cmd = Cmd.none }

        DoUpdated ( Result.Ok result ) ->
            { model = model
            , session = Session.succeed session ("The book \"" ++ model.bookdetails.libraryBook.title ++ "\" has been updated!")
            , cmd = Cmd.none }

        DoUpdated ( Result.Err error ) ->
            { model = model
            , session = Session.fail session ("The book has NOT been updated : " ++ buildErrorMessage error)
            , cmd = Cmd.none }

        _ ->
            { model = model, session = session, cmd = Cmd.none }


-- #####
-- #####   UTILITY
-- #####


-- Distribute Checkouts :
-- LibraryBooks = Book 1, Book 5, Book 3
-- Before :
--  checkouts = Book 5, Book 1
-- After :
--  checkoutsCorresponding = Book 1, Book 5, Nothing : CheckoutsCorresponding : Array (Maybe Checkout)


doAction: Model -> Int -> Model
doAction model index =
    let
        bookdetails = model.bookdetails

        bookdetails1 = 
            { bookdetails 
            | hasPrevious = False
            , hasNext = False
            }
        
    in
        { model
        | bookdetails = bookdetails1
        }

doActionCancel: Model -> Int -> Model
doActionCancel model index =
    { model
    | bookView = Details index
    }


doActionDone: Model -> Int -> Model
doActionDone model index =
    { model
    | bookView = DoActionDone index
    }

doIndex : Model -> Int -> Model
doIndex model index =
    let
        books_checkouts = merge2RemoteDatas model.booktiles.books model.booktiles.checkoutsDistributed
    in
        case books_checkouts of
            RemoteData.Success ( actualBooks, actualCheckouts ) ->
                let
                    bookdetails = model.bookdetails
                    libraryBook = Array.get index actualBooks |> Maybe.withDefault emptyLibrarybook
                    maybeCheckout = Array.get index actualCheckouts
                    maybeCheckout1 = 
                        case maybeCheckout of
                            Nothing  ->
                                Nothing
                            Just checkout ->
                                checkout
                    
                    bookdetails1 = 
                        { bookdetails 
                        | libraryBook = libraryBook
                        , maybeCheckout = maybeCheckout1
                        , hasPrevious = index > 0
                        , hasNext = index + 1 < Array.length actualBooks
                        }
                in
                    { model 
                    | bookdetails = bookdetails1
                    , bookView = Details index
                    }
            _ ->
                model

setBookView : BookView -> Model -> Model
setBookView bookView model = 
    { model
    | bookView = bookView
    }

setEditBook : LibraryBook -> Model -> Model
setEditBook book model =
    let
        bookedit = model.bookedit
    in
    { model
    | bookedit = 
        { bookedit 
        | book = book
        }
    }