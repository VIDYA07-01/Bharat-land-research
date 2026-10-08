const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    state: user.state,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    data: userData,
  });
};

module.exports = sendTokenResponse;
