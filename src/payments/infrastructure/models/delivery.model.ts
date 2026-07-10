import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'deliveries' })
export class DeliveryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  postalCode: string;

  @Column({ type: 'varchar', default: 'Colombia' })
  country: string;
}
