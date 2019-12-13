module MyStyles exposing (..)

import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)


card : List (Attribute msg)
card = [ style "overflow" "hidden"
    , style "box-shadow" "0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)"
    , style "-webkit-transition" ".25s box-shadow"
    , style "transition" ".25s box-shadow" ]

cardHover : List (Attribute msg)
cardHover = [ style "box-shadow" "0 5px 11px 0 rgba(0, 0, 0, 18), 0 4px 15px 0 rgba(0, 0, 0, 15)" ]