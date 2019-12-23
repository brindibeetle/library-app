module Library exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)

import Http as Http
import OAuth

import RemoteData exposing (WebData)

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Domain.Checkout exposing (..)
import Domain.Book exposing (..)
import Utils exposing (..)

import Css exposing (..)

import View.LibraryTiles as LibraryTiles exposing (..)
import View.LibraryDetails as BookDetails exposing (..)

type alias Model = 
    {
        librarybooks : WebData (Array LibraryBook)
        , checkouts : WebData (Array Checkout)
        , searchTitle : String 
        , searchAuthor : String 
        , searchLocation : String 
        , searchOwner : String 
        , bookView : BookView
        , checkinPromisedDate : String
        , booktiles : LibraryTiles.Config Msg LibraryBook
        , bookdetails : BookDetails.Config Msg LibraryBook
    }


type BookView =
    Tiles
    | Details Int
    | Checkout Int
    | CheckoutDone Int


initialModel : Model
initialModel =
    { librarybooks = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , searchTitle = ""
    , searchAuthor = ""
    , searchLocation = ""
    , searchOwner = ""
    , bookView = Tiles
    , checkinPromisedDate = ""
    , booktiles = 
        { updateSearchTitle = UpdateSearchTitle
        , updateSearchAuthor = UpdateSearchAuthor
        , updateSearchLocation = UpdateSearchLocation
        , updateSearchOwner = UpdateSearchOwner
        , doSearch = DoSearch
        , doAction = DoDetail
        , checkouts = RemoteData.NotAsked
        , books = RemoteData.NotAsked
         }
    , bookdetails = 
        { updateTitle = UpdateTitle
        , updateAuthors = UpdateAuthors
        , updateDescription = UpdateDescription
        , updatePublishedDate = UpdatePublishedDate
        , updateLanguage = UpdateLanguage
        , doAction = DoCheckout
        , textAction = "Do checkout"
        , doActionDisabled = False
        , doPrevious = DoPrevious
        , doNext = DoNext
        , doCancel = DoCancel
        , maybeBook = Nothing
        , maybeCheckout = Nothing
        , hasPrevious = False
        , hasNext = False
        , actionHtml = []
        }
    }


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.bookView of
        Tiles ->
            LibraryTiles.view model.booktiles
            
        Details index ->
            BookDetails.view model.bookdetails

        Checkout index ->
            BookDetails.view model.bookdetails

        CheckoutDone index ->
            BookDetails.view model.bookdetails

-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthor String
        | UpdateSearchLocation String
        | UpdateSearchOwner String
        | DoSearch
        | DoBooksReceived (WebData (Array (LibraryBook)))
        | DoCheckoutsReceived (WebData (Array Checkout))
        | DoDetail Int
        | UpdateTitle String
        | UpdateAuthors String
        | UpdateDescription String
        | UpdatePublishedDate String
        | UpdateLanguage String
        | DoNext
        | DoPrevious
        | DoCancel
        | DoCheckout
        | UpdateCheckinPromisedDate String
        | DoCheckoutDone (Result Http.Error ())



update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    let
        waarzijnwe = Debug.log "Library.elm update msg " msg
    in
    
    case ( model.bookView, msg ) of
        ( Tiles, UpdateSearchTitle title ) ->
           { model = { model | searchTitle = title }
           , session = session
           , cmd = Cmd.none }

        ( Tiles, UpdateSearchAuthor author ) ->
           { model = { model | searchAuthor = author }
           , session = session
           , cmd = Cmd.none }

        ( Tiles, UpdateSearchLocation location ) ->
           { model = { model | searchLocation = location }
           , session = session
           , cmd = Cmd.none }

        ( Tiles, UpdateSearchOwner owner ) ->
           { model = { model | searchOwner = owner }
           , session = session
           , cmd = Cmd.none }

        ( Tiles, DoSearch ) ->
            case session.token of
                Just token ->
                    let
                        booktiles = model.booktiles
                        booktiles1 = { booktiles | books = RemoteData.Loading }
                    in
                    
                    { model =  
                        { model 
                        | booktiles = booktiles1
                        , checkouts = RemoteData.Loading
                        , librarybooks = RemoteData.Loading
                        }
                    , session = session
                    , cmd = Cmd.batch 
                        [ Domain.LibraryBook.getBooks DoBooksReceived session token
                            { title = model.searchTitle
                            , author = model.searchAuthor
                            , location = model.searchLocation
                            , owner = model.searchOwner 
                            }
                        , getCheckoutsCurrent DoCheckoutsReceived session token 
                        ]
                     }
                Nothing ->
                    { model = model, session = session, cmd = Cmd.none }

        ( Tiles, DoBooksReceived response ) ->
            let
                booktiles = model.booktiles
                -- response
                
                booktiles1 = 
                    { booktiles 
                    | books = response
                    , checkouts = distributeCheckouts response model.checkouts 
                    }
            in
                { model = 
                    { model 
                    | booktiles = booktiles1
                    , librarybooks = response 
                    }
                    , session = session
                    , cmd = Cmd.none }
            -- { model =  distributeCheckouts { model | librarybooks = response }
            -- , session = session
            -- , cmd = Cmd.none }

        ( Tiles, DoCheckoutsReceived response ) ->
            let
                booktiles = model.booktiles
                booktiles1 = 
                    { booktiles 
                    | checkouts = distributeCheckouts model.librarybooks response
                    }
            in
                { model = { model | booktiles = booktiles1, checkouts = response }, session = session, cmd = Cmd.none }

            -- { model =  distributeCheckouts { model | checkouts = response }
            -- , session = session
            -- , cmd = Cmd.none }

        ( Tiles, DoDetail index ) ->
            { model = doIndex model index (Session.getUser session)
            , session = session
            , cmd = Cmd.none }
                
        ( Details index, DoPrevious ) ->
            { model = doIndex model (index - 1) (Session.getUser session)
            , session = session
            , cmd = Cmd.none }

        ( Details index, DoNext ) ->
            { model = doIndex model (index + 1) (Session.getUser session)
            , session = session
            , cmd = Cmd.none }

        ( Tiles, DoCancel ) -> -- TO DO
            { model = 
                { model 
                | bookView = Tiles
                }
                , session = session, cmd = Cmd.none }

        ( Details index, DoCancel ) ->
            { model = 
                { model 
                | bookView = Tiles
                }
                , session = session, cmd = Cmd.none }
        
        ( Details index, DoCheckout ) ->
            { model = doCheckout model index (Session.getUser session)
            , session = session
            , cmd = Cmd.none }

        ( Checkout index, DoCancel ) ->
            { model = doIndex model index (Session.getUser session)
                , session = session, cmd = Cmd.none }

        ( Checkout index, DoCheckout ) ->
            case ( model.bookdetails.maybeBook, session.token ) of
                ( Just book, Just token ) ->
                    { model = doCheckoutDone model index
                    , session = session
                    , cmd = Domain.Checkout.doCheckout DoCheckoutDone session token book.id }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }
            
        ( CheckoutDone index, DoCheckoutDone checkout ) ->
            case ( model.bookdetails.maybeBook, checkout ) of
                ( Just book, Result.Ok result ) ->
                    { model = model
                    , session = Session.succeed session ("The book \"" ++ book.title ++ "\" has been checked out!")
                    , cmd = Cmd.none }

                ( _, Result.Err error  ) ->
                    { model = model
                    , session = Session.fail session ("The book has NOT been checked out : " ++ buildErrorMessage error)
                    , cmd = Cmd.none }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }

        ( Details index, UpdateTitle title ) ->
                    { model = model, session = session, cmd = Cmd.none }
        ( Details index, UpdateAuthors author ) ->
                    { model = model, session = session, cmd = Cmd.none }
        ( Details index, UpdateDescription description ) ->
                    { model = model, session = session, cmd = Cmd.none }
        ( Details index, UpdateLanguage language ) ->
                    { model = model, session = session, cmd = Cmd.none }
        ( Details index, UpdatePublishedDate publishedDate ) ->
                    { model = model, session = session, cmd = Cmd.none }

        ( _, _ ) ->
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

distributeCheckouts : WebData (Array LibraryBook) -> WebData (Array Checkout) -> WebData (Array (Maybe Checkout))
distributeCheckouts librarybooks checkouts =
    case ( librarybooks, checkouts ) of
        ( RemoteData.Success actualLibraryBooks, RemoteData.Success actualCheckouts ) ->
            let
                actualCheckoutsList = Array.toList actualCheckouts
            in
            
                Array.toList actualLibraryBooks
                    |> List.map (distributeCheckoutsLibrarybook actualCheckoutsList )
                    |> Array.fromList
                    |> RemoteData.Success
    
        ( _, _ ) ->
            RemoteData.NotAsked


distributeCheckoutsLibrarybook : ( List Checkout ) -> LibraryBook -> Maybe Checkout
distributeCheckoutsLibrarybook actualCheckouts librarybook =
    List.filter (\checkout -> checkout.bookId == librarybook.id) actualCheckouts
    |> List.head


doIndex : Model -> Int -> String -> Model
doIndex model index user =
    let
        books_checkouts = merge2RemoteDatas model.booktiles.books model.booktiles.checkouts
    in
        case books_checkouts of
            RemoteData.Success ( actualBooks, actualCheckouts ) ->
                let
                    bookdetails = model.bookdetails
                    maybeBook = Array.get index actualBooks
                    maybeCheckout = Array.get index actualCheckouts
                    actionHtml = 
                        case maybeCheckout of
                            Just (Just checkout) ->
                                actionHtmlCheckout 
                                    { maybeCheckout = Just checkout
                                    , user = user
                                    }
                            _ ->
                                []
                    doActionDisabled = 
                        case maybeCheckout of
                            Just (Just _) ->
                                True 
                            _ ->
                                False
                    
                    bookdetails1 = 
                        { bookdetails 
                        | maybeBook = maybeBook
                        , hasPrevious = index > 0
                        , hasNext = index + 1 < Array.length actualBooks
                        , actionHtml = actionHtml
                        , doActionDisabled = doActionDisabled
                        }
                in
                    { model 
                    | bookdetails = bookdetails1
                    , bookView = Details index
                    }
            _ ->
                model


doCheckout: Model -> Int -> String -> Model
doCheckout model index user =
    let
        bookdetails = model.bookdetails
        maybeCheckout = bookdetails.maybeCheckout

        bookdetails1 = 
            { bookdetails 
            | actionHtml = actionHtmlCheckout 
                { maybeCheckout = maybeCheckout
                , user = user
                }
            , hasPrevious = False
            , hasNext = False
            }
        
    in
        { model
        | bookdetails = bookdetails1
        , bookView = Checkout index
        }


doCheckoutDone: Model -> Int -> Model
doCheckoutDone model index =
    { model
    | bookView = CheckoutDone index
    }

