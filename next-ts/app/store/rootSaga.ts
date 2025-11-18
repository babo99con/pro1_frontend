"use client";

import { all, fork } from "redux-saga/effects";
import { usersSaga } from "./features/users/usersSaga";
import { postsSaga } from "./features/posts/postsSaga";
import { commentsSaga } from "./features/comments/commentsSaga";
import { albumsSaga } from "./features/albums/albumsSaga";
import { photosSaga } from "./features/photos/photosSaga";
import { todosSaga } from "./features/todos/todosSaga";

export default function* rootSaga() {
  yield all([
    fork(usersSaga),
    fork(postsSaga),
    fork(commentsSaga),
    fork(albumsSaga),
    fork(photosSaga),
    fork(todosSaga),
  ]);
}
