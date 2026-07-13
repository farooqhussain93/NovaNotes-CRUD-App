def noteEntity(item) -> dict:
    created_at = item.get("created_at")
    if created_at:
        created_at_display = created_at.strftime("%b %d, %Y  %I:%M %p")
    else:
        created_at_display = "—"

    return {
        "id": str(item["_id"]),
        "title": item.get("title", ""),
        "desc": item.get("desc", ""),
        "important": item.get("important", False),
        "created_at": created_at_display
    }


def notesEntity(items) -> list:
    return [noteEntity(item) for item in items]