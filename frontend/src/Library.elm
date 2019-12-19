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
import BookSelectorDetail exposing (..)
import Session exposing (..)
import LibraryAppApi exposing (..)
import Domain.Checkout exposing (..)
import Domain.Book exposing (..)
import Utils exposing (..)

import Css exposing (..)

import View.BookTiles as BookTiles exposing (..)
import View.BookDetails as BookDetails exposing (..)

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
        , booktiles : BookTiles.Config Msg LibraryBookCheckout
        , bookdetails : BookDetails.Config Msg LibraryBookCheckout
    }


type BookView =
    Tiles
    | Details Int
    | Checkout Int
    | CheckoutDone Int


type alias LibraryBookCheckout =
    { id : Int
    , title : String
    , authors : String
    , description : String
    , publishedDate : String
    , language : String
    , smallThumbnail : String
    , thumbnail : String
    , owner : String
    , location : String
    , checkout : Maybe Checkout
    }

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
        , hasPrevious = False
        , hasNext = False
        , actionHtml = []
        }
    }





toBookLibraryBooks : WebData (Array LibraryBook) -> WebData (Array (Book LibraryBookCheckout))
toBookLibraryBooks librarybooks = 
        RemoteData.map (\a -> Array.toList a |> List.map toBookLibraryBook |> Array.fromList ) librarybooks


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.bookView of
        Tiles ->
            BookTiles.view model.booktiles
            
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
        | DoCheckoutDone (WebData (Array Checkout))



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
                    
                    { model =  { model | booktiles = booktiles1, checkouts = RemoteData.Loading, librarybooks = RemoteData.Loading }
                    , session = session
                    , cmd = Cmd.batch 
                        [ getBooks { token = token, msg = DoBooksReceived, title = model.searchTitle, author = model.searchAuthor, location = model.searchLocation, owner = model.searchOwner }
                        , getCheckoutsCurrent token DoCheckoutsReceived
                        ]
                     }
                Nothing ->
                    { model = model, session = session, cmd = Cmd.none }

        ( Tiles, DoBooksReceived response ) ->
            let
                booktiles = model.booktiles
                -- response
                
                booktiles1 = { booktiles | books = distributeCheckouts response model.checkouts }
            in
                { model = { model | booktiles = booktiles1, librarybooks = response }, session = session, cmd = Cmd.none }
            -- { model =  distributeCheckouts { model | librarybooks = response }
            -- , session = session
            -- , cmd = Cmd.none }

        ( Tiles, DoCheckoutsReceived response ) ->
            let
                booktiles = model.booktiles
                booktiles1 = { booktiles | books = distributeCheckouts model.librarybooks response }
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
                    , cmd = Domain.Checkout.doCheckout token DoCheckoutDone book.id }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }
            
        ( CheckoutDone index, DoCheckoutDone checkout ) ->
            case ( model.bookdetails.maybeBook, checkout ) of
                ( Just book, RemoteData.Success _ ) ->
                    { model = model
                    , session = Session.succeed session ("The book \"" ++ book.title ++ "\" has been checked out!")
                    , cmd = Cmd.none }

                ( _, RemoteData.Failure error ) ->
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

distributeCheckouts : WebData (Array LibraryBook) -> WebData (Array Checkout) -> WebData (Array (Book LibraryBookCheckout))
distributeCheckouts librarybooks checkouts =
    case ( librarybooks, checkouts ) of
        ( RemoteData.Success actualLibraryBooks, RemoteData.Success actualCheckouts ) ->
            let
                actualCheckoutsList = Array.toList actualCheckouts
            in
            
                Array.toList actualLibraryBooks
                    |> List.map toBookLibraryBook 
                    |> List.map (\book -> { book | checkout = distributeCheckoutsLibrarybook actualCheckoutsList book })
                    |> Array.fromList
                    |> RemoteData.Success
    
        ( _, _ ) ->
            RemoteData.NotAsked


distributeCheckoutsLibrarybook : ( List Checkout ) -> LibraryBookCheckout -> Maybe Checkout
distributeCheckoutsLibrarybook actualCheckouts librarybook =
    List.filter (\checkout -> checkout.bookId == librarybook.id) actualCheckouts
    |> List.head


toBookLibraryBook : LibraryBook -> Book LibraryBookCheckout
toBookLibraryBook librarybook = 
    { id = librarybook.id
    , title = librarybook.title
    , authors = librarybook.authors
    , description = librarybook.description
    , publishedDate = librarybook.publishedDate
    , language = librarybook.language
    , smallThumbnail = librarybook.smallThumbnail
    , thumbnail = librarybook.thumbnail
    , owner = librarybook.owner
    , location = librarybook.location
    , checkout = Nothing }


-- { authors : String
--                 , description : String
--                 , id : Int
--                 , language : String
--                 , location : String
--                 , owner : String
--                 , publishedDate : String
--                 , smallThumbnail : String
--                 , thumbnail : String
--                 , title : String
--                 }

doIndex : Model -> Int -> String -> Model
doIndex model index user =
    case model.booktiles.books of
        RemoteData.Success actualBooks ->
            let
                bookdetails = model.bookdetails
                maybeBook = Array.get index actualBooks
                maybeCheckout = maybeBook
                    |> Maybe.andThen .checkout
                actionHtml = 
                    case maybeCheckout of
                        Just checkout ->
                            actionHtmlCheckout 
                                { maybeCheckout = Just checkout
                                , user = user
                                }
                        Nothing ->
                            []
                doActionDisabled = 
                    case maybeCheckout of
                        Just _ ->
                            True 
                        Nothing ->
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
        maybeCheckout = bookdetails.maybeBook
            |> Maybe.andThen .checkout

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

