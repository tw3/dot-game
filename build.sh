#!/usr/bin/env bash

echo "" > public/index.js

echo public/SliderController.js >> public/index.js && \
  echo public/SliderRenderer.js >> public/index.js && \
  echo public/ScoreController.js >> public/index.js && \
  echo public/ScoreRenderer.js >> public/index.js && \
  echo public/CanvasModel.js >> public/index.js && \
  echo public/DotModel.js >> public/index.js && \
  echo public/GameController.js >> public/index.js && \
  echo public/GameRenderer.js >> public/index.js && \
  echo public/AppController.js >> public/index.js
