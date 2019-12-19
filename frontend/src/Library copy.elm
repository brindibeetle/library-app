module Library exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)

import Http as Http
import OAuth

import RemoteData exposing (RemoteData, WebData, succeed)

import MyError exposing (buildErrorMessage)

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
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block
import Bootstrap.Utilities.Display as Display

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import BookSelectorDetail exposing (..)
import Session exposing (..)
import LibraryAppApi exposing (..)
import Domain.Checkout exposing (..)

import Css exposing (..)


type alias Model = 
    {
        librarybooks : WebData (Array LibraryBook)
        , checkouts : WebData (Array Checkout)
        , checkoutsCorresponding : WebData (Array (Maybe Checkout))
        , searchTitle : String 
        , searchAuthor : String 
        , searchLocation : String 
        , searchOwner : String 
    }


type BookSelectorViewLevel =
    Tiles
    | Detail


initialModel : Model
initialModel =
    { librarybooks = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , checkoutsCorresponding = RemoteData.NotAsked
    , searchTitle = ""
    , searchAuthor = ""
    , searchLocation = ""
    , searchOwner = ""
    }


getBooks : { token : OAuth.Token, title : String, author : String, location : String, owner : String } -> Cmd Msg
getBooks { token, title, author, location, owner } =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" LibraryAppApi.libraryApiBooksUrl ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect = 
                libraryBooksDecoder
                |> Http.expectJson (RemoteData.fromResult >> DoBooksReceived)
            }


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    div []
        [ viewBookSearcher model
        , viewBooks model.librarybooks model.checkoutsCorresponding
        ]


viewBookSearcher : Model -> Html Msg
viewBookSearcher model =
    div [ class "container" ]
        [
            Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.id "searchbookTitle", Input.onInput UpdateSearchTitle ]
                , Form.help [] [ text "What is (part of) the title of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "searchbookAuthor", Input.onInput UpdateSearchAuthor   ]
                , Form.help [] [ text "What is (part of) the authors of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Location"]
                , Input.text [ Input.id "searchbookLocation", Input.onInput UpdateSearchLocation   ]
                , Form.help [] [ text "What is the location of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Owner of the book"]
                , Input.text [ Input.id "searchbookOwner", Input.onInput UpdateSearchOwner   ]
                , Form.help [] [ text "Who is the owner of the book." ]
                ]
            ]
        ]

viewFetchError : String -> Html Msg
viewFetchError errorMessage =
    let
        errorHeading =
            "Couldn't fetch posts at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]



viewBooks : WebData (Array LibraryBook) -> WebData (Array (Maybe Checkout)) -> Html Msg
viewBooks libraryBooks checkoutsCorresponding =
    let
                waarzijnwe = Debug.log "Library.elm viewBooks libraryBooks " libraryBooks
                waarzijnwe1 = Debug.log "Library.elm viewBooks checkoutsCorresponding " checkoutsCorresponding

    in
    
   -- viewBooks model.searchbooks
    case ( libraryBooks, checkoutsCorresponding ) of
        ( RemoteData.NotAsked, _ ) ->
            div [ class "container" ] 
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                ]

        ( RemoteData.Loading, _ ) ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        ( _, RemoteData.Loading ) ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        ( RemoteData.Success actualLibraryBooks,  RemoteData.Success actualCheckoutsCorresponding ) ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewBookTiles actualLibraryBooks actualCheckoutsCorresponding
                ]
                
        ( RemoteData.Failure httpError, _ ) ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewFetchError (buildErrorMessage httpError) 
                ]

        ( _, RemoteData.Failure httpError) ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewFetchError (buildErrorMessage httpError) 
                ]

        ( _,  _ ) ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewFetchError ( "Undefined Library.elm viewBooks" ) 
                ]

viewBookTiles : Array LibraryBook -> Array (Maybe Checkout) -> Html Msg
viewBookTiles librarybooks checkoutsCorresponding =
    List.range 0 (Array.length librarybooks - 1)
        |> List.map3 viewBookTilesCard (Array.toList librarybooks) (Array.toList checkoutsCorresponding)
        |> div [ class "row"  ]


-- "http://books.google.com/books/content?id=qR_NAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
-- zoom=1 -> zoom=10 for better resolution
getthumbnail : LibraryBook -> String
getthumbnail librarybook =
    String.replace "&zoom=1&" "&zoom=7&" librarybook.thumbnail


viewBookTilesCard : LibraryBook -> (Maybe Checkout) -> Int -> Html Msg
viewBookTilesCard librarybook checkoutCorresponding index =
    case checkoutCorresponding of
        Just checkout ->
            div [ class "col-lg-4 col-md-6 mb-4", onClick (ClickedBookDetail librarybook index) ]
                [ 
                    Card.config [ Card.attrs [ class "card-checkout" ] ]
                        |> Card.imgTop [ src (getthumbnail librarybook), class "bookselector-img-top" ] [] 
                        |> Card.block [ ] 
                            [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text librarybook.title ]
                            , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text librarybook.authors ]
                            , Block.text [ class "text-muted small bookselector-text-published" ] [ text librarybook.publishedDate ]
                            , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text librarybook.description ]
                            , Block.text [ class "text-muted small bookselector-text-language" ] [ text librarybook.language ]
                            , Block.text [ class "text-checkout" ] 
                                    [ p [] [ text "Checked out!" ]
                                    , p [ class "small" ] [ text ("from " ++ getNiceTime checkout.dateTimeFrom ++ ", by " ++ checkout.userEmail ) ]
                                    ]
                            ]
                        |> Card.imgBottom [ src (getthumbnail librarybook), class "bookselector-img-bottom" ] [] 
                        |> Card.view
                ]
        Nothing ->
            div [ class "col-lg-4 col-md-6 mb-4", onClick (ClickedBookDetail librarybook index) ]
                [ 
                    Card.config [ Card.attrs [] ]
                        |> Card.imgTop [ src (getthumbnail librarybook), class "bookselector-img-top" ] [] 
                        |> Card.block [ ] 
                            [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text librarybook.title ]
                            , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text librarybook.authors ]
                            , Block.text [ class "text-muted small bookselector-text-published" ] [ text librarybook.publishedDate ]
                            , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text librarybook.description ]
                            , Block.text [ class "text-muted small bookselector-text-language" ] [ text librarybook.language ]
                            ]
                        |> Card.imgBottom [ src (getthumbnail librarybook), class "bookselector-img-bottom" ] [] 
                        |> Card.view
                ]

        

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
        | DoBooksReceived (WebData (Array LibraryBook))
        | DoCheckoutsReceived (WebData (Array Checkout))
        | ClickedBookDetail LibraryBook Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    let
        waarzijnwe = Debug.log "Library.elm update msg " msg
    in
    
    case msg of
        UpdateSearchTitle title ->
           { model = { model | searchTitle = title }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthor author ->
           { model = { model | searchAuthor = author }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchLocation location ->
           { model = { model | searchLocation = location }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchOwner owner ->
           { model = { model | searchOwner = owner }
           , session = session
           , cmd = Cmd.none }

        DoSearch ->
            case session.token of
                Just token ->
                    { model =  { model | librarybooks = RemoteData.Loading }
                    , session = session
                    , cmd = Cmd.batch 
                        [ getBooks { token = token, title = model.searchTitle, author = model.searchAuthor, location = model.searchLocation, owner = model.searchOwner }
                        , getCheckouts token DoCheckoutsReceived
                        ]
                     }
                Nothing ->
                    { model = model, session = session, cmd = Cmd.none }

        DoBooksReceived response ->
            { model =  distributeCheckouts { model | librarybooks = response }
            , session = session
            , cmd = Cmd.none }

        DoCheckoutsReceived response ->
            { model =  distributeCheckouts { model | checkouts = response }
            , session = session
            , cmd = Cmd.none }

        ClickedBookDetail librarybook index ->
            -- case model.librarybooks of
                -- RemoteData.Success actualLibraryBooks ->
                --     { model = 
                --         { model 
                --         | bookSelectorDetailModel = Just (BookSelectorDetail.initialModel actualLibraryBooks index)
                --         }
                --     , session = changedPageSession BookSelectorDetailPage session
                --     , cmd = Cmd.none }
                
                -- _ ->
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

distributeCheckouts : Model -> Model
distributeCheckouts model =
    case ( model.librarybooks, model.checkouts ) of
        ( RemoteData.Success actualLibraryBooks, RemoteData.Success actualCheckouts ) ->
            { model
            | checkoutsCorresponding 
                = List.map ( distributeCheckoutsLibrarybook (Array.toList actualCheckouts) ) (Array.toList actualLibraryBooks)
                    |> Array.fromList
                    |> RemoteData.Success
            }
    
        ( _, _ ) ->
            model


distributeCheckoutsLibrarybook : ( List Checkout ) -> LibraryBook -> Maybe Checkout
distributeCheckoutsLibrarybook actualCheckouts librarybook =
    List.filter (\checkout -> checkout.bookId == librarybook.id) actualCheckouts
    |> List.head
