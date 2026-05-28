from fastapi import APIRouter, HTTPException
from app.database.db import get_prediction_history, delete_prediction, clear_prediction_history

router = APIRouter()

@router.get("", response_model=list)
async def get_history():
    try:
        return get_prediction_history()
    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{prediction_id}")
async def delete_history_item(prediction_id: int):
    try:
        delete_prediction(prediction_id)
        return {"status": "success", "message": f"Record {prediction_id} deleted."}
    except Exception as e:
        print(f"Error deleting record {prediction_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("")
async def clear_all_history():
    try:
        clear_prediction_history()
        return {"status": "success", "message": "All clinical records cleared."}
    except Exception as e:
        print(f"Error clearing history: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
