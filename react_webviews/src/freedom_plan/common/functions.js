

  const initiatePayment = async (data) => {
    try {
      resetErrorData();
      setShowLoader("button");
      const result = await triggerPayment(data);
      setShowLoader("page");
      const config = getConfig();
      const redirectUrl = encodeURIComponent(
        `${getBasePath()}${PATHNAME_MAPPER.paymentStatus}${config.searchParams}`
      );
      let paymentLink = result.payment_link;
      paymentLink = `${paymentLink}${
        paymentLink.match(/[\?]/g) ? "&" : "?"
      }redirect_url=${redirectUrl}`;
      window.location.href = paymentLink;
    } catch (err) {
      setErrorData({
        ...errorData,
        showError: true,
        title2: err.message,
        handleClick2: resetErrorData,
      });
      setShowLoader(false);
    }
  };