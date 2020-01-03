module View.LibraryTiles exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)
import Dict

import RemoteData exposing (WebData)

import Utils exposing (buildErrorMessage)

import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block

import Domain.Checkout exposing (..)
import Domain.LibraryBook exposing (..)
import Utils exposing (..)
import Session exposing (..)

import Css exposing (..)


-- #####
-- #####   CONFIG
-- #####


type alias Config =
    { userEmail : String

    , searchTitle : String 
    , searchAuthors : String 
    , searchLocation : String 
    , searchOwner : String 
    , searchCheckStatus : String 
    , searchCheckoutUser : String

    , showSearchTitle : Bool
    , showSearchAuthors : Bool
    , showSearchLocation : Bool
    , showSearchOwner : Bool
    , showSearchCheckStatus : Bool
    , showSearchCheckoutUser : Bool

    , books : WebData (Array LibraryBook) 
    , checkouts : WebData (Array Checkout)
    , checkoutsDistributed : WebData (Array (Maybe Checkout)) 
    }

intialConfig : String ->  Config
intialConfig userEmail =
    { userEmail = userEmail

    , searchTitle = ""
    , searchAuthors = ""
    , searchLocation = ""
    , searchOwner = ""
    , searchCheckStatus = ""
    , searchCheckoutUser = ""

    , showSearchTitle = False
    , showSearchAuthors = False
    , showSearchLocation = False
    , showSearchOwner = False
    , showSearchCheckStatus = False
    , showSearchCheckoutUser = False

    , books = RemoteData.NotAsked
    , checkouts = RemoteData.NotAsked
    , checkoutsDistributed = RemoteData.NotAsked
    }


initialModelCmd : Session -> ( Config, Cmd Msg )
initialModelCmd session1 =
    let
        { model, session, cmd } = doSearch ( intialConfig (Session.getUser session1)) session1
    in
        ( model, cmd )


setShowSearch : { title : Bool, authors : Bool, location : Bool, owner : Bool, checkStatus : Bool, checkoutUser : Bool } -> Config -> Config
setShowSearch { title, authors, location, owner, checkStatus, checkoutUser } config =
    { config 
    | showSearchTitle = title
    , showSearchAuthors = authors
    , showSearchLocation = location
    , showSearchOwner = owner
    , showSearchCheckStatus = checkStatus
    , showSearchCheckoutUser = checkoutUser
    }


setSearch : { title : String, authors : String, location : String, owner : String, checkStatus : String, checkoutUser : String } -> Config -> Config
setSearch { title, authors, location, owner, checkStatus, checkoutUser } config =
    { config 
    | searchTitle = title
    , searchAuthors = authors
    , searchLocation = location
    , searchOwner = owner
    , searchCheckStatus = checkStatus
    , searchCheckoutUser = checkoutUser
    }


-- #####
-- #####   VIEW
-- #####


-- view : WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) ->  Html Msg
view : Config -> Html Msg
view config =
    div [ class "row containerFluid"]
        [ div [ class "col-lg-2 col-md-3 mb-4" ]
            [ viewBookFilter config ]
        , div [ class "col-lg-8" ]
            [ viewBooks config ]
        ]


viewBookFilter : Config -> Html Msg
viewBookFilter config =
    let
        { books } = config

    in
        div [ class "container" ]
            [
                Form.form []
                [ 
                    if config.showSearchTitle then
                        Form.group []
                            [ Form.label [ ] [ text "Title"]
                            , Input.text [ Input.small, Input.value config.searchTitle, Input.onInput UpdateSearchTitle ]
                            ]
                        else
                            div [] []
                    , if config.showSearchAuthors then
                        Form.group []
                            [ Form.label [ ] [ text "Author(s)"]
                            , Input.text [  Input.small,Input.value config.searchAuthors, Input.onInput UpdateSearchAuthors ]
                            ]
                        else
                            div [] []
                    , if config.showSearchLocation then
                        Form.group []
                            [ Form.label [ ] [ text "Location"]
                            , Select.select [ Select.onChange UpdateSearchLocation
                                ]
                                ( List.map (selectitem config.searchLocation) (("","") :: getLocations books) )
                            ]
                        else
                            div [] []
                    , if config.showSearchOwner then
                        Form.group []
                            [ Form.label [ ] [ text "Owner"]
                            , Select.select [ Select.onChange UpdateSearchOwner
                                ]
                                ( List.map (selectitem config.searchOwner) (("","") :: getOwners books) )
                            ]
                        else
                            div [] []
                    , if config.showSearchCheckStatus then
                        Form.group []
                            [ Form.label [ ] [ text "Availability"]
                            , Select.select [ Select.onChange UpdateSearchCheckStatus
                                ]
                                ( List.map (selectitem config.searchCheckStatus) (("","") :: Dict.toList checkedStatusList) )
                            ]
                        else
                            div [] []
                    , if config.showSearchCheckoutUser then
                        Form.group []
                            [ Form.label [ ] [ text "Checked out by"]
                            , Select.select [ Select.onChange UpdateSearchCheckoutUser
                                ]
                                ( List.map (selectitem config.searchCheckoutUser) (("","") :: getCheckoutUsers config.checkoutsDistributed ) )
                            ]
                        else
                            div [] []
                    -- , Button.button
                    --     [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick doSearch ]
                    --     [ text "Filter" ]
                ]
            ]


viewFetchError : String -> Html msg
viewFetchError errorMessage =
    let
        errorHeading =
            "Couldn't fetch posts at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]

merge2RemoteDatas :
    RemoteData.RemoteData e a
    -> RemoteData.RemoteData e b
    -> RemoteData.RemoteData e ( a, b)
merge2RemoteDatas a b = 
        RemoteData.map (\a1 b1 -> ( a1, b1 )) a
            |> RemoteData.andMap b

-- viewBooks : msg -> WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) -> Html msg
-- viewBooks doSearch books checkoutsCorresponding =
viewBooks : Config -> Html Msg
viewBooks config =
    let
        { books, checkoutsDistributed } = config
        books_checkouts = merge2RemoteDatas books checkoutsDistributed
    in
    case books_checkouts of
        RemoteData.NotAsked ->
            div [ class "container" ] 
                [ p [] [ br [] [] ]
                ]

        RemoteData.Loading ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        RemoteData.Success ( actualBooks, actualCheckouts ) ->
            div [ class "containerFluid" ]
                [ viewBookTiles config actualBooks actualCheckouts ]
                
        RemoteData.Failure httpError ->
            div [ class "container" ]
                [ viewFetchError (buildErrorMessage httpError) 
                ]

        
viewBookTiles : Config -> Array LibraryBook -> Array (Maybe Checkout) -> Html Msg
viewBookTiles config books checkouts =
    List.range 0 (Array.length books - 1)
        |> List.map3 bookCheckoutIndex (Array.toList books) (Array.toList checkouts)
        |> List.filterMap
            ( booksFilter 
                        { searchTitle = config.searchTitle
                        , searchAuthors = config.searchAuthors
                        , searchOwner = config.searchOwner
                        , searchLocation = config.searchLocation
                        , searchCheckStatus = config.searchCheckStatus
                        , searchCheckoutUser = config.searchCheckoutUser
                        }
            )
        |> List.map (viewBookTilesCard config)
        |> div [ class "row"  ]


-- "http://books.google.com/books/content?id=qR_NAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
-- zoom=1 -> zoom=10 for better resolution
getthumbnail : LibraryBook -> String
getthumbnail book =
    String.replace "&zoom=1&" "&zoom=7&" book.thumbnail


viewBookTilesCard : Config -> { book : LibraryBook , checkout : Maybe Checkout , index : Int } -> Html Msg
viewBookTilesCard { userEmail } { book, checkout, index } =
    case checkout of
        Just checkout1 ->
            if ( userEmail == checkout1.userEmail) then
                div [ class "col-lg-3 col-md-4 mb-4", onClick (DoDetail index) ]
                    [ 
                        Card.config [ Card.attrs [ class "card-checkout-x" ] ]
                            |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                            |> Card.block [ ] 
                                [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                                , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                                , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                                , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                                , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                                , Block.text [ class "text-checkout-x" ] 
                                        [ p [] [ text "Checked out!" ]
                                        , p [ class "small" ] [ text ("from " ++ getNiceTime checkout1.dateTimeFrom ++ ", by You" ) ]
                                        ]
                                ]
                            |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                            |> Card.view
                    ]
            else
                    div [ class "col-lg-3 col-md-4 mb-4", onClick (DoDetail index) ]
                    [ 
                        Card.config [ Card.attrs [ class "card-checkout" ] ]
                            |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                            |> Card.block [ ] 
                                [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                                , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                                , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                                , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                                , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                                , Block.text [ class "text-checkout" ] 
                                        [ p [] [ text "Checked out!" ]
                                        , p [ class "small" ] [ text ("from " ++ getNiceTime checkout1.dateTimeFrom ++ ", by " ++ checkout1.userEmail ) ]
                                        ]
                                ]
                            |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                            |> Card.view
                    ]

        Nothing ->
            div [ class "col-lg-3 col-md-4 mb-4", onClick (DoDetail index) ]
            -- div [ class "col-lg-4 col-md-6 mb-4", onClick (doAction index) ]
                [ 
                    Card.config [ Card.attrs [] ]
                        |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                        |> Card.block [ ] 
                            [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                            , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                            , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                            , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                            , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                            ]
                        |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                        |> Card.view
                ]
        

-- #####
-- #####   UPDATE
-- #####

type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthors String
        | UpdateSearchLocation String
        | UpdateSearchOwner String
        | UpdateSearchCheckStatus String
        | UpdateSearchCheckoutUser String
        | DoSearch
        | DoBooksReceived (WebData (Array (LibraryBook)))
        | DoCheckoutsReceived (WebData (Array Checkout))
        | DoDetail Int


update : Msg -> Config -> Session -> { model : Config, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdateSearchTitle title ->
           { model = setSearchTitle title model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthors authors ->
           { model = setSearchAuthors authors model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchLocation location ->
           { model = setSearchLocation location model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchOwner owner ->
           { model = setSearchOwner owner model
           , session = session
           , cmd = Cmd.none }

        UpdateSearchCheckStatus status ->
            { model = setCheckStatus status model
            , session = session
            , cmd = Cmd.none }

        UpdateSearchCheckoutUser user ->
            { model = setCheckoutUser user model
            , session = session
            , cmd = Cmd.none }

        DoSearch ->
            doSearch model session

        DoBooksReceived response ->
            { model = 
                { model 
                | books = response 
                , checkoutsDistributed = distributeCheckouts response model.checkouts 
                }
                , session = session
                , cmd = Cmd.none }

        DoCheckoutsReceived response ->
            { model = 
                { model
                | checkouts = response
                , checkoutsDistributed = distributeCheckouts model.books response
                }
                , session = session
                , cmd = Cmd.none }

        DoDetail index ->
            { model = model
            , session = session
            , cmd = Cmd.none }



-- #####
-- #####   UTILITY
-- #####


doSearch : Config -> Session -> { model : Config, session : Session, cmd : Cmd Msg } 
doSearch model session =
    case session.token of
        Just token ->
            { model =  
                { model 
                | checkouts = RemoteData.Loading
                , books = RemoteData.Loading
                }
            , session = session
            , cmd = Cmd.batch 
                [ Domain.LibraryBook.getBooks DoBooksReceived session token
                , getCheckoutsCurrent DoCheckoutsReceived session token 
                ]
                }
        Nothing ->
            { model = model, session = session, cmd = Cmd.none }


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






setSearchTitle : String -> Config -> Config
setSearchTitle title config =
    { config | searchTitle = title }

setSearchAuthors : String -> Config -> Config
setSearchAuthors authors config =
    { config | searchAuthors = authors }


setSearchLocation : String -> Config -> Config
setSearchLocation location config =
    { config | searchLocation = location }


setSearchOwner : String -> Config -> Config
setSearchOwner owner config =
    { config | searchOwner = owner }


setCheckStatus : String -> Config -> Config
setCheckStatus status config =
    { config | searchCheckStatus = status }


setCheckoutUser : String -> Config -> Config
setCheckoutUser user config =
    { config | searchCheckoutUser = user }
 

getLocations : WebData (Array LibraryBook) -> List ( String, String )
getLocations webDataBooks =
    case webDataBooks of
        RemoteData.Success actualBooks ->
            List.foldl addLocation [] (Array.toList actualBooks)
            
        _ ->
            []


addLocation : LibraryBook -> List (String, String) -> List (String, String)
addLocation book locations =
    if book.location == "" then
        locations
    else
        if List.member ( book.location, book.location ) locations then
            locations
        else
            ( book.location, book.location ) :: locations


getOwners : WebData (Array LibraryBook) -> List ( String, String )
getOwners webDataBooks =
    case webDataBooks of
        RemoteData.Success actualBooks ->
            List.foldl addOwner [] (Array.toList actualBooks)
            
        _ ->
            []

addOwner : LibraryBook -> List (String, String) -> List (String, String)
addOwner book owners =
    if book.owner == "" then
        owners
    else
        if List.member (book.owner, book.owner) owners then
            owners
        else
            ( book.owner, book.owner ) :: owners

getCheckoutUsers : WebData (Array (Maybe Checkout)) -> List ( String, String )
getCheckoutUsers webDataCheckouts =
    case webDataCheckouts of
        RemoteData.Success actualCheckouts ->
            Array.toList actualCheckouts
            |> List.foldl addCheckoutUser []
            
        _ ->
            []

addCheckoutUser : Maybe Checkout -> List (String, String) -> List (String, String)
addCheckoutUser maybeCheckout users =
    case maybeCheckout of
        Just checkout ->
            if checkout.userEmail == "" then
                users
            else
                if List.member (checkout.userEmail, checkout.userEmail) users then
                    users
                else
                    ( checkout.userEmail, checkout.userEmail ) :: users

        Nothing ->
            users



selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    case valueSelected == value1 of
        True ->
            Select.item [ selected True, value value1 ] [ text text1 ] 

        False ->
            Select.item [ value value1 ] [ text text1 ] 



booksFilter : 
    { searchTitle : String, searchAuthors : String, searchOwner : String, searchLocation : String, searchCheckStatus : String, searchCheckoutUser : String } 
    -> { book: LibraryBook, checkout: Maybe Checkout, index: Int } 
    -> Maybe { book: LibraryBook, checkout: Maybe Checkout, index: Int }
booksFilter 
    { searchTitle, searchAuthors, searchOwner, searchLocation, searchCheckStatus, searchCheckoutUser } 
    { book, checkout, index } =
    if
        ( String.isEmpty searchTitle || String.contains (String.toUpper searchTitle) (String.toUpper book.title) )
        && ( String.isEmpty searchAuthors || String.contains (String.toUpper searchAuthors) (String.toUpper book.authors) )
        && ( String.isEmpty searchOwner || searchOwner == book.owner) 
        && ( String.isEmpty searchLocation || searchOwner == book.location) 
        && ( String.isEmpty searchCheckStatus 
            || ( searchCheckStatus == "available" && checkout == Nothing )
            || ( searchCheckStatus == "checkedout" && checkout /= Nothing )
        )
        && ( String.isEmpty searchCheckoutUser 
            || case checkout of
                Just checkout1 ->
                    checkout1.userEmail == searchCheckoutUser
            
                Nothing ->
                    False
        )
    then
        Just { book = book, checkout = checkout, index = index }
    else
        Nothing


bookCheckoutIndex : LibraryBook -> Maybe Checkout -> Int -> { book: LibraryBook, checkout: Maybe Checkout, index: Int }
bookCheckoutIndex book checkout index =
    { book = book, checkout = checkout, index = index }