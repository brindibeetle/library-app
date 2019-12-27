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
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Select as Select
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block

import Domain.Checkout exposing (..)
import Domain.LibraryBook exposing (..)
import Utils exposing (..)

import Css exposing (..)


-- #####
-- #####   CONFIG
-- #####


type alias Config msg =
    { userEmail : String

    , searchTitle : String 
    , searchAuthors : String 
    , searchLocation : String 
    , searchOwner : String 
    , searchCheckStatus : String 
    , searchCheckoutUser : String

    , updateSearchTitle :  String -> msg 
    , updateSearchAuthors :  String -> msg 
    , updateSearchLocation :  String -> msg 
    , updateSearchOwner :  String -> msg 
    , updateSearchCheckStatus :  String -> msg 
    , updateSearchCheckoutUser :  String -> msg 

    , showSearchTitle : Bool
    , showSearchAuthors : Bool
    , showSearchLocation : Bool
    , showSearchOwner : Bool
    , showSearchCheckStatus : Bool
    , showSearchCheckoutUser : Bool

    , doSearch : msg
    , doAction : Int -> msg
    , books : WebData (Array LibraryBook) 
    , checkouts : WebData (Array (Maybe Checkout)) 
    }



setShowSearch : { title : Bool, authors : Bool, location : Bool, owner : Bool, checkStatus : Bool, checkoutUser : Bool } -> Config msg -> Config msg
setShowSearch { title, authors, location, owner, checkStatus, checkoutUser } config =
    { config 
    | showSearchTitle = title
    , showSearchAuthors = authors
    , showSearchLocation = location
    , showSearchOwner = owner
    , showSearchCheckStatus = checkStatus
    , showSearchCheckoutUser = checkoutUser
    }


setSearch : { title : String, authors : String, location : String, owner : String, checkStatus : String, checkoutUser : String } -> Config msg -> Config msg
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
view : Config msg -> Html msg
view config =
    div [ class "row containerFluid"]
        [ div [ class "col-lg-2 col-md-3 mb-4" ]
            [ viewBookFilter config ]
        , div [ class "col-lg-8" ]
            [ viewBooks config ]
        ]


viewBookFilter : Config msg -> Html msg
viewBookFilter config =
    let
        { books, doSearch } = config

    in
        div [ class "container" ]
            [
                Form.form []
                [ 
                    if config.showSearchTitle then
                        Form.group []
                            [ Form.label [ ] [ text "Title"]
                            , Input.text [ Input.small, Input.value config.searchTitle, Input.onInput (config.updateSearchTitle) ]
                            ]
                        else
                            div [] []
                    , if config.showSearchAuthors then
                        Form.group []
                            [ Form.label [ ] [ text "Author(s)"]
                            , Input.text [  Input.small,Input.value config.searchAuthors, Input.onInput (config.updateSearchAuthors)   ]
                            ]
                        else
                            div [] []
                    , if config.showSearchLocation then
                        Form.group []
                            [ Form.label [ ] [ text "Location"]
                            , Select.select [ Select.onChange config.updateSearchLocation
                                ]
                                ( List.map (selectitem config.searchLocation) (("","") :: getLocations books) )
                            ]
                        else
                            div [] []
                    , if config.showSearchOwner then
                        Form.group []
                            [ Form.label [ ] [ text "Owner"]
                            , Select.select [ Select.onChange config.updateSearchOwner
                                ]
                                ( List.map (selectitem config.searchOwner) (("","") :: getOwners books) )
                            ]
                        else
                            div [] []
                    , if config.showSearchCheckStatus then
                        Form.group []
                            [ Form.label [ ] [ text "Availability"]
                            , Select.select [ Select.onChange config.updateSearchCheckStatus
                                ]
                                ( List.map (selectitem config.searchCheckStatus) (("","") :: Dict.toList checkedStatusList) )
                            ]
                        else
                            div [] []
                    , if config.showSearchCheckoutUser then
                        Form.group []
                            [ Form.label [ ] [ text "Checked out by"]
                            , Select.select [ Select.onChange config.updateSearchCheckoutUser
                                ]
                                ( List.map (selectitem config.searchCheckoutUser) (("","") :: getCheckoutUsers config.checkouts ) )
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
viewBooks : Config msg -> Html msg
viewBooks config =
    let
        { books, checkouts, doSearch } = config

        waarzijnwe = Debug.log "Library.elm viewBooks libraryBooks " books
        -- waarzijnwe1 = Debug.log "Library.elm viewBooks checkoutsCorresponding " checkouts

        books_checkouts = merge2RemoteDatas books checkouts
        
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

        
viewBookTiles : Config msg -> Array LibraryBook -> Array (Maybe Checkout) -> Html msg
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


viewBookTilesCard : Config msg -> { book : LibraryBook , checkout : Maybe Checkout , index : Int } -> Html msg
viewBookTilesCard { doAction, userEmail } { book, checkout, index } =
    case checkout of
        Just checkout1 ->
            if ( userEmail == checkout1.userEmail) then
                div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
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
                    div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
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
            div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
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
-- #####   UTILITY
-- #####


setSearchTitle : String -> Config msg -> Config msg
setSearchTitle title config =
    { config | searchTitle = title }

setSearchAuthors : String -> Config msg -> Config msg
setSearchAuthors authors config =
    { config | searchAuthors = authors }


setSearchLocation : String -> Config msg -> Config msg
setSearchLocation location config =
    { config | searchLocation = location }


setSearchOwner : String -> Config msg -> Config msg
setSearchOwner owner config =
    { config | searchOwner = owner }


setCheckStatus : String -> Config msg -> Config msg
setCheckStatus status config =
    { config | searchCheckStatus = status }


setCheckoutUser : String -> Config msg -> Config msg
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