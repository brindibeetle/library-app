module Checkin exposing (..)

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

import View.LibraryTiles as Tiles exposing (..)
import View.LibraryDetails as BookDetails exposing (..)

type alias Model = 
    {
        librarybooks : WebData (Array LibraryBook)
        , checkouts : WebData (Array Checkout)
        , bookView : BookView
        , booktiles : Tiles.Config 
        , bookdetails : BookDetails.Config Msg
    }


type BookView =
    Tiles
    | Details Int
    | Confirm Int
    | DoActionDone Int


initialModel : String -> Model
initialModel userEmail =
    { librarybooks = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , bookView = Tiles
    , booktiles = Tiles.intialConfig userEmail
    , bookdetails = 
        { userEmail = userEmail
        , doAction1 = { msg = DoCheckout, text = "Checkout", disabled = False, visible = True }
        , doAction2 = { msg = DoCheckout, text = "", disabled = False, visible = False }
        , remarks = ""
        , doPrevious = DoPrevious
        , doNext = DoNext
        , doCancel = DoCancel
        , libraryBook = emptyLibrarybook
        , maybeCheckout = Nothing
        , hasPrevious = False
        , hasNext = False
        }
    }


initialModelCmd : Session -> ( Model, Cmd Msg )
initialModelCmd session1 =
    let
        userEmail = Session.getUser session1
        ( booktiles, cmd ) = Tiles.initialModelCmd session1 
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
    

-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.bookView of
        Tiles ->
            Tiles.view model.booktiles |> Html.map LibraryTilesMsg
            
        Details index ->
            viewDetails index model

        Confirm index ->
            viewConfirm index model

        DoActionDone index ->
            BookDetails.view model.bookdetails


viewDetails : Int -> Model -> Html Msg
viewDetails index model =
    let
        bookdetails = model.bookdetails
    in
        case bookdetails.maybeCheckout of
            Just checkout ->
                if checkout.userEmail == bookdetails.userEmail then
                    BookDetails.view  
                        { bookdetails
                        | doAction1 = { msg = DoCheckin, text = "Check in", disabled = False, visible = True }
                        , remarks = "You checked this book out at " ++ (getNiceTime checkout.dateTimeFrom) ++ "."
                        }
                else
                    BookDetails.view  
                        { bookdetails
                        | doAction1 = { msg = DoCheckout, text = "Check out", disabled = True, visible = True }
                        , remarks = checkout.userEmail ++  " checked this book out at " ++ (getNiceTime checkout.dateTimeFrom) ++ "."
                        }


            Nothing ->
                BookDetails.view  
                    { bookdetails
                    | doAction1 = { msg = DoCheckout, text = "Check out", disabled = False, visible = True }
                    , remarks = ""
                    }


viewConfirm : Int -> Model -> Html Msg
viewConfirm index model =
    let
        bookdetails = model.bookdetails
    in
        case bookdetails.maybeCheckout of
            Just checkout ->
                if checkout.userEmail == bookdetails.userEmail then
                    BookDetails.view  
                        { bookdetails
                        | doAction1 = { msg = DoCheckin, text = "Confirm", disabled = False, visible = True }
                        , remarks = "Please confirm that the book is checked in by " ++ bookdetails.userEmail ++ "."
                        }
                else
                    -- this may not occur ...
                    BookDetails.view  
                        { bookdetails
                        | doAction1 = { msg = DoCheckin, text = "Check out", disabled = True, visible = True }
                        , remarks = checkout.userEmail ++  " checked this book out at " ++ (getNiceTime checkout.dateTimeFrom) ++ "."
                        }


            Nothing ->
                BookDetails.view  { bookdetails
                | doAction1 = { msg = DoCheckout, text = "Confirm", disabled = False, visible = True }
                , remarks = "Please confirm that the book is checked out by " ++ bookdetails.userEmail ++ "."
                }


-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        LibraryTilesMsg Tiles.Msg

        | DoNext
        | DoPrevious
        | DoCancel
        | DoCheckout
        | DoCheckin
        | DoCheckoutDone (Result Http.Error ())
        | DoCheckinDone (Result Http.Error ())



update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg1 model1 session1 =
    let
        a = Debug.log "update msg = " msg1
        -- a1 = Debug.log "update model.searchTitle = " model.searchTitle
        -- a2 = Debug.log "update msg = " msg
    in
    
    case msg1 of
        LibraryTilesMsg (DoDetail index) ->
            { model = doIndex model1 index
            , session = session1
            , cmd = Cmd.none
            }

        LibraryTilesMsg subMsg ->
            let
                { model, session, cmd } = Tiles.update subMsg model1.booktiles session1
                model2 = 
                    { model1
                    | booktiles = model
                    }
            in
                { model = model2, session = session, cmd = cmd |> Cmd.map LibraryTilesMsg }
        _ ->
            case model1.bookView of
                Details index ->
                    updateDetails msg1 model1 session1 index

                Confirm index ->
                    updateConfirm msg1 model1 session1 index
                    
                DoActionDone index ->
                    updateDoActionDone msg1 model1 session1 index

                _ ->
                    { model = model1, session = session1, cmd = Cmd.none }

            
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
        
        DoCheckout ->
            { model = doAction model index
            , session = session
            , cmd = Cmd.none }

        DoCheckin ->
            { model = doAction model index
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

        DoCheckout ->
            case session.token of
                Just token ->
                    { model = doActionDone model index
                    , session = session
                    , cmd = Domain.Checkout.doCheckout DoCheckoutDone session token model.bookdetails.libraryBook.id }

                _ ->
                    { model = model, session = session, cmd = Cmd.none }
            
        DoCheckin ->
            case session.token of
                Just token ->
                    { model = doActionDone model index
                    , session = session
                    , cmd = Domain.Checkout.doCheckin DoCheckinDone session token model.bookdetails.libraryBook.id }

                _ ->
                    { model = model, session = session, cmd = Cmd.none }
            
        _ ->
            { model = model, session = session, cmd = Cmd.none }


updateDoActionDone : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDoActionDone msg model session index =
    case msg of
        DoCheckoutDone checkout ->
            case checkout of
                Result.Ok result ->
                    { model = model
                    , session = Session.succeed session ("The book \"" ++ model.bookdetails.libraryBook.title ++ "\" has been checked out!")
                    , cmd = Cmd.none }

                Result.Err error ->
                    { model = model
                    , session = Session.fail session ("The book has NOT been checked out : " ++ buildErrorMessage error)
                    , cmd = Cmd.none }

        DoCheckinDone checkout ->
            case checkout of
                Result.Ok result ->
                    { model = model
                    , session = Session.succeed session ("The book \"" ++ model.bookdetails.libraryBook.title ++ "\" has been checked in!")
                    , cmd = Cmd.none }

                Result.Err error ->
                    { model = model
                    , session = Session.fail session ("The book has NOT been checked in : " ++ buildErrorMessage error)
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
        , bookView = Confirm index
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