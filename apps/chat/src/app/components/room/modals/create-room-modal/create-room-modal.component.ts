import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CreateRoomModalData {
  roomName: string;
}

@Component({
  selector: 'shane-chat-create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.scss'],
})
export class CreateRoomModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateRoomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoomModalData
  ) {}
}
