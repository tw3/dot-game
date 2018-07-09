#!/usr/bin/env bash

touch public/index.js

cat public/SliderController.js > public/index.js && \
  cat public/SliderRenderer.js >> public/index.js && \
  cat public/ScoreController.js >> public/index.js && \
  cat public/ScoreRenderer.js >> public/index.js && \
  cat public/CanvasModel.js >> public/index.js && \
  cat public/DotModel.js >> public/index.js && \
  cat public/GameController.js >> public/index.js && \
  cat public/GameRenderer.js >> public/index.js && \
  cat public/AppController.js >> public/index.js
