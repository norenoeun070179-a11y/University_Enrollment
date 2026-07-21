import { Request, Response } from "express";
import Department from '../models/department.model'

const toOptionalInteger = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
};

export const getDepartment = async (req: Request, res: Response) => {
    try{
        const data = await Department.findAll();
    res.json({data})
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to get departments" });
    }
};

export const createDepartment = async (req: Request, res: Response) => {
    try{
        const { department_id, department_name, office_location, phone,price_semester } = req.body;
        const dep_name: string = String(department_name).trim();
        const dep_location: string = String(office_location).trim();
        const dep_phone: string = String(phone).trim();

        if (!department_name || !office_location) {
            return res.status(400).json({ message: 'department_name and office_location are required' });
        }

        const data = await Department.create({
            department_id: toOptionalInteger(department_id),
            department_name: dep_name,
            office_location: dep_location,
            phone : dep_phone,
            price_semester
        });
        res.json({
            data
        })
    
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to create departments" });
    }
};

export const deleteDepartment = async (req:Request , res:Response) => {
    try{
        const department_id = Number(req.params.id);
        const data = await Department.findByPk(department_id);

        if (!data) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await data.destroy();
        return res.json({ message: 'Department deleted' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to delete departments" });
    }
}

export const getIdDepartment = async (req:Request , res:Response) => {
    try{
        const department_id =Number( req.params.id);
    
        const data = await Department.findByPk(department_id);
        
        if(data==null && !data){
            res.status(404).json({message:"data not found !"})
        }

        res.json({
            message : "Data get successfully ",
            data
        })

    }catch(err){
        console.error(err);
        res.status(400).json({ message: "Failed to get data" });
    }
}

export const updateDepartment = async (req: Request, res: Response) => {
  try {

    const department_id = Number(req.params.id);

    const {department_name,office_location,phone,price_semester} = req.body;
        const dep_name: string = String(department_name).trim();
        const dep_location: string = String(office_location).trim();
        const dep_phone: string = String(phone).trim();

    if (isNaN(department_id)) {
      return res.status(400).json({
        message: "Invalid ID"
      });
    }

    const data = await Department.findByPk(department_id);

    if (!data) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    await data.update({
        department_name: dep_name ?? data.get("department_name"),
        office_location: dep_location ?? data.get("office_location"),
        phone: dep_phone ?? data.get("phone"),
        price_semester: price_semester ?? data.get("price_semester")
    });

    return res.status(200).json({
      message: "Update success",
      data
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};
