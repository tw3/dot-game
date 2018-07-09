#!/usr/bin/env bash

touch public/index.js

cat src/AppController.js > public/index.js && \
  echo "" >> public/index.js && \
  cat src/GameController.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/GameRenderer.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/ScoreController.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/ScoreRenderer.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/SliderController.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/SliderRenderer.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/CanvasModel.js >> public/index.js && \
  echo "" >> public/index.js && \
  cat src/DotModel.js >> public/index.js
