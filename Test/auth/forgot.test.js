const {
  ChangePassword,
} = require('../../presentation/controller/forgotController');
const {
  ChangePasswordService,
} = require('../../application/services/ForgotService');

jest.mock('../../application/services/ForgotService');

describe('Forgot Password Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'newpassword123',
        password2: 'newpassword123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test for successful password change
  it('should return 200 if password successfully changed', async () => {
    ChangePasswordService.mockResolvedValue({
      success: true,
      message: 'Password updated successfully',
    });

    await ChangePassword(req, res);

    expect(ChangePasswordService).toHaveBeenCalledWith(
      'test@example.com',
      'newpassword123',
      'newpassword123'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Password updated successfully',
    });
  });

  // ❌ Test for mismatch passwords
  it('should return 400 if passwords do not match', async () => {
    req.body.password2 = 'different123';

    await ChangePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Passwords do not match',
    });
  });

  // ❌ Test for short passwords
  it('should return 400 if password length is less than 6', async () => {
    req.body.password = '123';
    req.body.password2 = '123';

    await ChangePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Password must be at least 6 characters',
    });
  });

  // ❌ Test for failed service (e.g. user not found)
  it('should return 400 if service returns failure', async () => {
    ChangePasswordService.mockResolvedValue({
      success: false,
      message: 'User cannot be found',
    });

    await ChangePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User cannot be found',
    });
  });

  // ⚠️ Test for thrown error in service
  it('should catch thrown error and return 400', async () => {
    ChangePasswordService.mockRejectedValue(new Error('Database error'));

    await ChangePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Database error',
      message: 'Database error',
    });
  });
});
