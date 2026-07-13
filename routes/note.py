from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from config.db import conn
from serializers.note import noteEntity, notesEntity


note = APIRouter()

templates = Jinja2Templates(directory="templates")


@note.get("/", response_class=HTMLResponse)
async def read_notes(request: Request):
    docs = conn.notes.notes.find({})
    all_notes = notesEntity(docs)
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"notes": all_notes}
    )


@note.post("/")
async def save_note(
    note_id: str = Form(None),
    title: str = Form(..., min_length=1, max_length=100),
    desc: str = Form(..., min_length=1, max_length=1000),
    important: bool = Form(False)
):
    title = title.strip()
    desc = desc.strip()

    if not title or not desc:
        return RedirectResponse(url="/?msg=error", status_code=303)
    
    if note_id:
        try:
            conn.notes.notes.update_one(
                {"_id": ObjectId(note_id)},
                {"$set": {"title": title, "desc": desc, "important": important}}
            )
        except InvalidId:
            return RedirectResponse(url="/?msg=error", status_code=303)
        return RedirectResponse(url="/?msg=updated", status_code=303)
    
    else:
        conn.notes.notes.insert_one({
            "title": title,
            "desc": desc,
            "important": important,
            "created_at": datetime.utcnow()
        })
        return RedirectResponse(url="/?msg=created", status_code=303)


@note.get("/delete/{note_id}")
async def delete_note(note_id: str):
    try:
        conn.notes.notes.delete_one({"_id": ObjectId(note_id)})
    except InvalidId:
        pass
    return RedirectResponse(url="/?msg=deleted", status_code=303)