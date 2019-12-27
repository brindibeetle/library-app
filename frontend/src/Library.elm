module Library exposing (..)

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
import Domain.Book exposing (..)
import Utils exposing (..)

import Css exposing (..)

import View.LibraryTiles as LibraryTiles exposing (..)
import View.LibraryDetails as BookDetails exposing (..)

type alias Model = 
    {
        librarybooks : WebData (Array LibraryBook)
        , checkouts : WebData (Array Checkout)
        , bookView : BookView
        , booktiles : LibraryTiles.Config Msg LibraryBook
        , bookdetails : BookDetails.Config Msg LibraryBook
    }


type BookView =
    Tiles
    | Details Int
    | DoAction Int
    | DoActionDone Int


initialModel : String -> Model
initialModel userEmail =
    { librarybooks = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , bookView = Tiles
    , booktiles = 
        { userEmail = userEmail

        , searchTitle = ""
        , searchAuthors = ""
        , searchLocation = ""
        , searchOwner = ""
        , searchCheckStatus = ""
        , searchCheckoutUser = ""

        , updateSearchTitle = UpdateSearchTitle
        , updateSearchAuthors = UpdateSearchAuthors
        , updateSearchLocation = UpdateSearchLocation
        , updateSearchOwner = UpdateSearchOwner
        , updateSearchCheckStatus = UpdateSearchCheckStatus
        , updateSearchCheckoutUser = UpdateSearchCheckoutUser
        
        , showSearchTitle = True
        , showSearchAuthors = True
        , showSearchLocation = True
        , showSearchOwner = True
        , showSearchCheckStatus = True
        , showSearchCheckoutUser = True

        , doSearch = DoSearch
        , doAction = DoDetail
        , checkouts = RemoteData.NotAsked
        , books = RemoteData.NotAsked
        }
    , bookdetails = 
        { userEmail = userEmail
        , doCheckout = DoCheckout
        , doCheckin = DoCheckin
        , doPrevious = DoPrevious
        , doNext = DoNext
        , doCancel = DoCancel
        , maybeBook = Nothing
        , maybeCheckout = Nothing
        , hasPrevious = False
        , hasNext = False
        , doActionPrepare = False
        }
    }


initialModelCmd : Session -> ( Model, Cmd Msg )
initialModelCmd session1 =
    let
        { model, session, cmd } = doSearch ( initialModel (Session.getUser session1)) session1
    in
        ( model, cmd )
    


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

        DoAction index ->
            BookDetails.view model.bookdetails

        DoActionDone index ->
            BookDetails.view model.bookdetails


-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthors String
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
        | UpdateLocation String
        | UpdateOwner String
        | UpdateSearchCheckStatus String
        | UpdateSearchCheckoutUser String
        | DoNext
        | DoPrevious
        | DoCancel
        | DoCheckout
        | DoCheckin
        | UpdateCheckinPromisedDate String
        | DoCheckoutDone (Result Http.Error ())
        | DoCheckinDone (Result Http.Error ())



update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    let
        a = Debug.log "update msg = " msg
        -- a1 = Debug.log "update model.searchTitle = " model.searchTitle
        -- a2 = Debug.log "update msg = " msg
    in
    
    case model.bookView of
        Tiles ->
            updateTiles msg model session

        Details index ->
            updateDetails msg model session index

        DoAction index ->
            updateDoAction msg model session index
            
        DoActionDone index ->
            updateDoActionDone msg model session index

    

updateTiles : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
updateTiles msg model session =
    let
        waarzijnwe = Debug.log "Library.elm updateTiles msg " msg
    in
    case msg of
        UpdateSearchTitle title ->
           { model = model.booktiles |> setSearchTitle title |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthors authors ->
           { model = model.booktiles |> setSearchAuthors authors |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchLocation location ->
           { model = model.booktiles |> setSearchLocation location |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchOwner owner ->
           { model = model.booktiles |> setSearchOwner owner |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchCheckStatus status ->
            { model = model.booktiles |> setCheckStatus status |> setBookTiles model
            , session = session
            , cmd = Cmd.none }

        UpdateSearchCheckoutUser user ->
            { model = model.booktiles |> setCheckoutUser user |> setBookTiles model
            , session = session
            , cmd = Cmd.none }

        DoSearch ->
            doSearch model session

        DoBooksReceived response ->
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

        DoCheckoutsReceived response ->
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

        DoDetail index ->
            { model = doIndex model index
            , session = session
            , cmd = Cmd.none }


        DoCancel -> -- TO DO
            { model = 
                { model 
                | bookView = Tiles
                }
                , session = session, cmd = Cmd.none }

        _ ->
            { model = model, session = session, cmd = Cmd.none }


doSearch : Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
doSearch model session =
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
                , getCheckoutsCurrent DoCheckoutsReceived session token 
                ]
                }
        Nothing ->
            { model = model, session = session, cmd = Cmd.none }

            
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


updateDoAction : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDoAction msg model session index =
    case msg of
        DoCancel ->
            { model = doActionCancel (doIndex model index) index
                , session = session, cmd = Cmd.none }

        DoCheckout ->
            case ( model.bookdetails.maybeBook, session.token ) of
                ( Just book, Just token ) ->
                    { model = doActionDone model index
                    , session = session
                    , cmd = Domain.Checkout.doCheckout DoCheckoutDone session token book.id }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }
            
        DoCheckin ->
            case ( model.bookdetails.maybeBook, session.token ) of
                ( Just book, Just token ) ->
                    { model = doActionDone model index
                    , session = session
                    , cmd = Domain.Checkout.doCheckin DoCheckinDone session token book.id }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }
            
        _ ->
            { model = model, session = session, cmd = Cmd.none }


updateDoActionDone : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDoActionDone msg model session index =
    case msg of
        DoCheckoutDone checkout ->
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


        DoCheckinDone checkout ->
            case ( model.bookdetails.maybeBook, checkout ) of
                ( Just book, Result.Ok result ) ->
                    { model = model
                    , session = Session.succeed session ("The book \"" ++ book.title ++ "\" has been checked in!")
                    , cmd = Cmd.none }

                ( _, Result.Err error  ) ->
                    { model = model
                    , session = Session.fail session ("The book has NOT been checked in : " ++ buildErrorMessage error)
                    , cmd = Cmd.none }

                ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }


        _ ->
            { model = model, session = session, cmd = Cmd.none }


-- #####
-- #####   UTILITY
-- #####
            
setBookTiles : Model -> LibraryTiles.Config Msg LibraryBook -> Model 
setBookTiles model booktiles =
    { model | booktiles = booktiles }


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


doIndex : Model -> Int -> Model
doIndex model index =
    let
        books_checkouts = merge2RemoteDatas model.booktiles.books model.booktiles.checkouts
    in
        case books_checkouts of
            RemoteData.Success ( actualBooks, actualCheckouts ) ->
                let
                    bookdetails = model.bookdetails
                    maybeBook = Array.get index actualBooks
                    maybeCheckout = Array.get index actualCheckouts
                    maybeCheckout1 = 
                        case maybeCheckout of
                            Nothing  ->
                                Nothing
                            Just checkout ->
                                checkout
                    
                    bookdetails1 = 
                        { bookdetails 
                        | maybeBook = maybeBook
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


doAction: Model -> Int -> Model
doAction model index =
    let
        bookdetails = model.bookdetails

        bookdetails1 = 
            { bookdetails 
            | doActionPrepare = True
            , hasPrevious = False
            , hasNext = False
            }
        
    in
        { model
        | bookdetails = bookdetails1
        , bookView = DoAction index
        }

doActionCancel: Model -> Int -> Model
doActionCancel model index =
    let
        bookdetails = model.bookdetails

        bookdetails1 = 
            { bookdetails 
            | doActionPrepare = False
            }
        
    in
        { model
        | bookdetails = bookdetails1
        , bookView = Details index
        }


doActionDone: Model -> Int -> Model
doActionDone model index =
    { model
    | bookView = DoActionDone index
    }

