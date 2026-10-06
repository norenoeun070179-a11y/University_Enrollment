import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare payment_id: CreationOptional<number>;

  declare student_id: number;

  declare customer_id: number | null;
  declare department_id: number;

  declare amount: number;

  declare currency: string;

  declare payment_method: string;

  declare status: string;

  declare transaction_id: string | null;

  declare qr_code: string | null;

  declare qr_md5: string | null;

  declare qr_expiration: number | null;

  declare bakong_hash: string | null;

  declare paid_at: Date | null;

  declare description: string | null;
}

Payment.init(
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD"
    },

    payment_method: {
      type: DataTypes.ENUM(
        "khqr",
        "cash",
        "bank_transfer"
      ),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "failed",
        "cancelled",
        "expired"
      ),
      defaultValue: "pending"
    },

    transaction_id: {
      type: DataTypes.STRING(255)
    },

    qr_code: {
      type: DataTypes.TEXT
    },

    qr_md5: {
      type: DataTypes.STRING(32),
      unique: true
    },

    qr_expiration: {
      type: DataTypes.BIGINT
    },

    bakong_hash: {
      type: DataTypes.STRING(255)
    },

    paid_at: {
      type: DataTypes.DATE
    },

    description: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
    underscored: true
  }
);

export default Payment;
