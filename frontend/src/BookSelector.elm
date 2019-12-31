module BookSelector exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import RemoteData exposing (WebData)

import Array exposing (..)
import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Utils exposing (..)
import View.SelectorTiles as SelectorTiles exposing (..)
import View.SelectorDetails as SelectorDetails exposing (..)
import View.LibraryEdit as LibraryEdit exposing (..)
import Session exposing (..)

type alias Model = 
    {
        searchbooks : WebData SearchBooks

        , bookView : BookView

        , booktiles : SelectorTiles.Config Msg
        , bookdetails : SelectorDetails.Config Msg
        , bookDetailsEdit : LibraryEdit.Config
    }

initialModel : Model
initialModel =
    { searchbooks = RemoteData.NotAsked
    , bookView = Tiles
    , booktiles = 
        { searchTitle = ""
        , searchAuthors = ""
        , searchString = ""
        , searchIsbn = 0
        , updateSearchTitle = UpdateSearchTitle
        , updateSearchAuthor = UpdateSearchAuthor
        , updateSearchIsbn = UpdateSearchIsbn
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
    , bookDetailsEdit = { book = emptyLibrarybook, doInsert = { visible = True}, doUpdate  = {visible = False }}
    }

initialBookDetailsEdit : (Maybe SearchBook) -> String -> LibraryEdit.Config
initialBookDetailsEdit searchBook user =
    { book = case searchBook of
        Just actualSearchBook ->
            searchbook2librarybook actualSearchBook |> setOwner user
            
        Nothing ->
            emptyLibrarybook
    , doInsert = { visible = True}
    , doUpdate  = {visible = False }
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
            LibraryEdit.view model.bookDetailsEdit |> Html.map LibraryEditMsg
            

-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthor String
        | UpdateSearchString String
        | UpdateSearchIsbn String
        | DoSearch
        | DoBooksReceived (WebData (Array SearchBook))
        | DoDetail Int

        | LibraryEditMsg LibraryEdit.Msg

        | DoNext
        | DoPrevious
        | DoCancel
        | DoAddToLibrary

update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg1 model1 session1 =
    let
        a = Debug.log "update msg = " msg1
        -- a1 = Debug.log "update model.searchTitle = " model.searchTitle
        -- a2 = Debug.log "update msg = " msg
    in
    case model1.bookView of
        Tiles ->
            updateTiles msg1 model1 session1

        Details index ->
            updateDetails msg1 model1 session1 index

        DetailsEdit index ->
            case msg1  of
                LibraryEditMsg LibraryEdit.DoCancel ->
                    { model = 
                        { model1 
                        | bookView = Details index
                        }
                        , session = session1, cmd = Cmd.none }

                LibraryEditMsg subMsg ->
                    let
                        { model, session, cmd } = LibraryEdit.update subMsg model1.bookDetailsEdit session1
                        model2 = 
                            { model1
                            | bookDetailsEdit = model
                            }
                    in
                        { model = model2, session = session, cmd = cmd |> Cmd.map LibraryEditMsg }

                _ ->
                    { model = model1, session = session1, cmd = Cmd.none }


updateTiles : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
updateTiles msg model session =
    case msg of
        UpdateSearchTitle title ->
           { model = model.booktiles |> setSearchTitle title |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthor authors ->
           { model = model.booktiles |> setSearchAuthors authors |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchIsbn isbn ->
           { model = model.booktiles |> setSearchIsbn ( isbn |> String.toInt |> Maybe.withDefault 0 ) |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchString string ->
           { model = model.booktiles |> setSearchString string |> setBookTiles model
           , session = session
           , cmd = Cmd.none }

        DoSearch ->
           { model =  { model | searchbooks = RemoteData.Loading }
           , session = session
           , cmd = Domain.SearchBook.getBooks DoBooksReceived 
                    { searchTitle = model.booktiles.searchTitle
                    , searchAuthors = model.booktiles.searchAuthors
                    , searchIsbn = model.booktiles.searchIsbn
                    , searchString = model.booktiles.searchString }
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
                    , bookDetailsEdit = initialBookDetailsEdit searchBook (Session.getUser session)
                    }
                    , session = session, cmd = Cmd.none }

        _ ->
            { model = model, session = session, cmd = Cmd.none}




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


-- #####
-- #####   UTILS
-- #####


setBookTiles : Model -> SelectorTiles.Config Msg -> Model 
setBookTiles model booktiles =
    { model | booktiles = booktiles }
