module BookSelector exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import Http as Http
import RemoteData exposing (WebData)

import Array exposing (..)
import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Utils exposing (..)
import View.SelectorTiles as SelectorTiles exposing (..)
import View.SelectorDetails as SelectorDetails exposing (..)
import View.SelectorDetailsEdit as SelectorDetailsEdit exposing (..)
import Session exposing (..)

type alias Model = 
    {
        searchbooks : WebData SearchBooks
        , searchTitle : String 
        , searchAuthors : String 
        , searchString : String 
        -- , searchIsbn : Int

        , bookView : BookView

        , booktiles : SelectorTiles.Config Msg
        , bookdetails : SelectorDetails.Config Msg
        , bookDetailsEdit : Maybe (SelectorDetailsEdit.Config Msg)
    }

initialModel : Model
initialModel =
    { searchbooks = RemoteData.NotAsked
    , searchTitle = ""
    , searchAuthors = ""
    , searchString = ""
    -- , searchIsbn = 0
    , bookView = Tiles
    , booktiles = 
        { updateSearchTitle = UpdateSearchTitle
        , updateSearchAuthor = UpdateSearchAuthor
        , updateSearchString = UpdateSearchString
        , doSearch = DoSearch
        , doAction = DoDetail
        , books = RemoteData.NotAsked
         }
    , bookdetails = 
        { doAction = DoAddToLibrary
        , textAction = "Add to library"
        , doActionDisabled = False
        , doPrevious = DoPrevious
        , doNext = DoNext
        , doCancel = DoCancel
        , maybeBook = Nothing
        , hasPrevious = False
        , hasNext = False
        , actionHtml = []
        }
    , bookDetailsEdit = Nothing
    }

initialBookDetailsEdit : (Maybe SearchBook) -> String -> SelectorDetailsEdit.Config Msg
initialBookDetailsEdit searchBook user =
    { updateTitle =  UpdateTitle
    , updateAuthors = UpdateAuthors
    , updateDescription = UpdateDescription 
    , updatePublishedDate = UpdatePublishedDate
    , updateLanguage = UpdateLanguage
    , updateOwner = UpdateOwner
    , updateLocation = UpdateLocation
    , doAction = DoLibraryBookInsert
    , textAction = "Add to library"
    , doActionDisabled = True
    , doCancel = DoCancel
    , book = case searchBook of
        Just actualSearchBook ->
            searchbook2librarybook actualSearchBook |> setOwner user
            
        Nothing ->
            emptyLibrarybook
    }


type BookView =
    Tiles
    | Details Int
    | DetailsEdit Int


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.bookView of
        Tiles ->
            SelectorTiles.view model.booktiles
            
        Details index ->
            SelectorDetails.view model.bookdetails

        DetailsEdit index ->
            case model.bookDetailsEdit of
                Just bookDetailsEdit ->
                    SelectorDetailsEdit.view bookDetailsEdit
            
                Nothing ->
                    div [] []                    
            


-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthor String
        | UpdateSearchString String
        | DoSearch
        | DoBooksReceived (WebData (Array SearchBook))
        | DoDetail Int
        | UpdateTitle String
        | UpdateAuthors String
        | UpdateDescription String
        | UpdatePublishedDate String
        | UpdateLanguage String
        | UpdateOwner String
        | UpdateLocation String
        | DoNext
        | DoPrevious
        | DoCancel
        | DoAddToLibrary
        | DoLibraryBookInsert
        | LibraryBookInserted (Result Http.Error LibraryBook)


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    let
        a = Debug.log "BookSelector update model.bookView" model.bookView
        a2 = Debug.log "BookSelector update msg " msg
    in
    
    case model.bookView of
        Tiles ->
            updateTiles msg model session
        
        Details index ->
            updateDetails msg model session index

        DetailsEdit index ->
            updateDetailsEdit msg model session index
    

updateTiles : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
updateTiles msg model session =
    case msg of
        UpdateSearchTitle title ->
           { model = { model | searchTitle = title }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthor authors ->
           { model = { model | searchAuthors = authors }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchString string ->
           { model = { model | searchString = string }
           , session = session
           , cmd = Cmd.none }

        DoSearch ->
           { model =  { model | searchbooks = RemoteData.Loading }
           , session = session
           , cmd = Domain.SearchBook.getBooks DoBooksReceived { searchTitle = model.searchTitle, searchAuthors = model.searchAuthors, searchString = model.searchString }
           }

        DoBooksReceived response ->
            let
                booktiles = model.booktiles
                -- response
                
                booktiles1 = 
                    { booktiles 
                    | books = response
                    }
            in
                { model =  { model | booktiles = booktiles1 }
                , session = session
                , cmd = Cmd.none }

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
            { model = model, session = session, cmd = Cmd.none}


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
        
        DoAddToLibrary ->
            let
                searchBook = model.bookdetails.maybeBook
            in
                { model = 
                    { model 
                    | bookView = DetailsEdit index
                    , bookDetailsEdit = Just (initialBookDetailsEdit searchBook (Session.getUser session))
                    }
                    , session = session, cmd = Cmd.none }

        _ ->
            { model = model, session = session, cmd = Cmd.none}


updateDetailsEdit : Msg -> Model -> Session -> Int -> { model : Model, session : Session, cmd : Cmd Msg } 
updateDetailsEdit msg model session index =
    case ( msg, model.bookDetailsEdit ) of
        ( DoCancel, _ ) ->
            { model = 
                { model 
                | bookView = Details index
                }
                , session = session, cmd = Cmd.none }

        ( UpdateTitle title, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setTitle title
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdateAuthors authors, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setAuthors authors
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdateDescription description, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setDescription description
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdateLanguage language, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setLanguage language
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdatePublishedDate publishedDate, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setPublishedDate publishedDate
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdateOwner owner, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setOwner owner
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( UpdateLocation location, Just bookDetailsEdit ) ->
            let
                book = bookDetailsEdit.book |> setLocation location
                bookDetailsEdit1 = { bookDetailsEdit | book = book }
            in
                { model = { model | bookDetailsEdit = Just bookDetailsEdit1 }, session = session, cmd = Cmd.none }

        ( DoLibraryBookInsert, Just bookDetailsEdit ) ->
            case session.token of
                Just token ->
                    let
                        libraryAppApiCmd = Debug.log " oLibraryBookInsert -> "
                            insertBook LibraryBookInserted token bookDetailsEdit.book
                    in
                        { model = model, session = session, cmd = libraryAppApiCmd }
                Nothing ->
                        { model = model, session = session, cmd = Cmd.none }

        ( LibraryBookInserted (Result.Err err), Just bookDetailsEdit ) ->
            { model = model
            , session = Session.fail session ("LibraryBookInserted Result.Err error : " ++ buildErrorMessage err)
            , cmd = Cmd.none
            }
                
        ( LibraryBookInserted (Result.Ok libraryBookInserted), Just bookDetailsEdit ) ->
            { model = model
            , session = Session.succeed session ("The book \"" ++ bookDetailsEdit.book.title ++ "\" has been added to the library!")
            , cmd = Cmd.none 
            }

        ( _, _ ) ->
                    { model = model, session = session, cmd = Cmd.none }


-- #####
-- #####   UTILITY
-- #####
            
    
doIndex : Model -> Int -> Model
doIndex model index =
    case model.booktiles.books of
        RemoteData.Success actualBooks ->
            let
                bookdetails = model.bookdetails
                maybeBook = Array.get index actualBooks
                actionHtml = 
                            []
                doActionDisabled = 
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
