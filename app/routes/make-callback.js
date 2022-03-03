/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

export default (controller) => (req, res) => {
  const httpRequest = {
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    method: req.method,
    path: req.path,
    user: req.user,
    logger: req.logger,
    source: {
      ip: req.ip,
      browser: req.get('User-Agent')
    },
    headers: {
      'Content-Type': req.get('Content-Type'),
      Referer: req.get('referer'),
      'User-Agent': req.get('User-Agent')
    }
  };

  controller(httpRequest)
    .then((httpResponse) => {
      if (httpResponse && httpResponse.contentType === 'application/octet-stream') {
        res.setHeader('content-disposition', `attachment; filename=${httpResponse.fileName}`);
        res.set('Content-Type', 'application/octet-stream');
        res.attachment(httpResponse.fileName);
        res.status(200).send({success: true});
      }
      if (httpResponse && httpResponse.contentType === 'text/csv' && httpResponse.csv) {
        res.setHeader('content-disposition', `attachment; filename=${httpResponse.fileName}`);
        res.setHeader('Content-Type', 'text/csv');
        res.attachment(httpResponse.fileName);
        return res.status(200).send(httpResponse.csv);
      }
      res.set('Content-Type', 'application/json');
      res.type('json');
      const body = {
        success: true,
        code: 200,
        data: httpResponse
      };
      res.status(200).send(body);
    })
    .catch((e) => {
      console.error(e);
      console.log(JSON.stringify(e));
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message
        }
      });
    });
};
