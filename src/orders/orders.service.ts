import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";
import { Model } from "mongoose";
import { ProductsService } from '../products/products.service'; // Import ProductService

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService, // Inject the ProductsService
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productResult = await this.productsService.findOne(
      createOrderDto.productId
    );

    if(!productResult){
      throw new NotFoundException('product not found')
    }

    const result = new this.orderModel(createOrderDto)
    return result.save();
  }

  // populate ใช้ productId ดึงข้อมูลจาก product
  async findOne(id: string): Promise<Order> {
    const order = this.orderModel.findById(id).populate('productId').exec();
    return order;
  }
}