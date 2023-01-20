import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn, VersionColumn } from 'typeorm';

export class timestamp {
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @CreateDateColumn({update:false})
    createdAt: Date;
    
    @VersionColumn()
    version: number
  
}