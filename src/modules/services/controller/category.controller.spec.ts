import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category';
import { CategoryService } from '../service/category';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  const mockCategory: Category = {
    id: 1,
    name: 'Test Category',
    description: 'Test Category Description',
    created_at: new Date(),
    updated_at: new Date(),
    steps: [],
    services: [],
  } as Category;

  const mockCategories: Category[] = [mockCategory];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      jest.spyOn(categoryService, 'findAll').mockResolvedValue(mockCategories);

      const result = await categoryController.findAll();

      expect(result).toBe(mockCategories);
      expect(categoryService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no categories exist', async () => {
      jest.spyOn(categoryService, 'findAll').mockResolvedValue([]);

      const result = await categoryController.findAll();

      expect(result).toEqual([]);
      expect(categoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = 1;
      jest.spyOn(categoryService, 'findOne').mockResolvedValue(mockCategory);

      const result = await categoryController.findOne(categoryId);

      expect(result).toBe(mockCategory);
      expect(categoryService.findOne).toHaveBeenCalledWith(categoryId);
    });

    it('should throw error when category not found', async () => {
      const categoryId = 999;
      jest.spyOn(categoryService, 'findOne').mockRejectedValue(new Error('Category not found'));

      await expect(categoryController.findOne(categoryId)).rejects.toThrow('Category not found');
      expect(categoryService.findOne).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
        description: 'New Category Description',
      };

      jest.spyOn(categoryService, 'create').mockResolvedValue(mockCategory);

      const result = await categoryController.create(createCategoryDto);

      expect(result).toBe(mockCategory);
      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should create a category with steps', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
        description: 'New Category Description',
        steps: [
          {
            name: 'Step 1',
            description: 'Step 1 Description',
            observation: 'Step 1 Observation',
            responsable_client: 'Client Contact 1',
          },
          {
            name: 'Step 2',
            description: 'Step 2 Description',
            observation: 'Step 2 Observation',
            responsable_client: 'Client Contact 2',
          },
        ],
      };

      jest.spyOn(categoryService, 'create').mockResolvedValue(mockCategory);

      const result = await categoryController.create(createCategoryDto);

      expect(result).toBe(mockCategory);
      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should throw error when category creation fails', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Category',
        description: 'New Category Description',
      };

      jest.spyOn(categoryService, 'create').mockRejectedValue(new Error('Category already exists'));

      await expect(categoryController.create(createCategoryDto)).rejects.toThrow('Category already exists');
      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Category Description',
      };

      const updatedCategory = { 
        ...mockCategory, 
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
      };
      jest.spyOn(categoryService, 'update').mockResolvedValue(updatedCategory);

      const result = await categoryController.update(categoryId, updateCategoryDto);

      expect(result).toBe(updatedCategory);
      expect(categoryService.update).toHaveBeenCalledWith(categoryId, updateCategoryDto);
    });

    it('should throw error when category update fails', async () => {
      const categoryId = 999;
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      jest.spyOn(categoryService, 'update').mockRejectedValue(new Error('Category not found'));

      await expect(categoryController.update(categoryId, updateCategoryDto)).rejects.toThrow('Category not found');
      expect(categoryService.update).toHaveBeenCalledWith(categoryId, updateCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const categoryId = 1;
      jest.spyOn(categoryService, 'delete').mockResolvedValue(undefined);

      await categoryController.delete(categoryId);

      expect(categoryService.delete).toHaveBeenCalledWith(categoryId);
    });

    it('should throw error when category deletion fails', async () => {
      const categoryId = 999;
      jest.spyOn(categoryService, 'delete').mockRejectedValue(new Error('Category not found'));

      await expect(categoryController.delete(categoryId)).rejects.toThrow('Category not found');
      expect(categoryService.delete).toHaveBeenCalledWith(categoryId);
    });
  });

});
